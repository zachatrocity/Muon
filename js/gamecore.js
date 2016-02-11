var Move = function(f, t, p) {
	this.from = f;
	this.to = t;
	this.player = p;
};

// An object that holds all the logic associated with running the gamecore
var gameCore = {
	// The initial position of player 1
	p1Pos: 0b00000111110000000000,
	// The initial position of player 2 (the opponent)
	p2Pos: 0b00000000001111100000,
	// The flags for P1 and P2 for if they can can create a triangle in their starting quadrant
	playerOneFlag: true,
	playerTwoFlag: true,
	// Flag for the current player's turn
	player1Turn: true,
	// The available moves for a position can be found through 'evaluation.nodeConnections'
	ai: AI,
	// A list of the past ~10 move that the player/opponet have made (5 ea.)
	moveHistory: [],

	//gameboard
	board: {
		nodes: [],
		links: [],
		width: 700,
    	height: 700,
		foci: 	[{x: 5, y: 5}, {x: 300, y: 5},        //
                        {x: 150, y: 150},              // Quad A
                {x: 5, y: 300}, {x: 300, y: 300},    //

                {x: 400, y: 400}, {x: 675, y: 400},   //
                        {x: 550, y: 550},             // Quad D
                {x: 400, y: 675}, {x: 675, y: 675},  //
                
                {x: 400, y: 5}, {x: 675, y: 5},    //
                      {x: 550, y: 150},                // Quad B
                {x: 400, y: 300}, {x: 675, y: 300},    //
                
                {x: 5, y: 400}, {x: 300, y: 400},   //
                         {x: 200, y: 500},            // Quad C
                {x: 5, y: 675}, {x: 300, y: 675}],   //
        boardSVG: '',
        d3force: '',
        activeNodes: '',
        activeLinks: '',
        tick: function(e){
        	var k = .1 * e.alpha;

		    //Push center nodes toward their designated focus.
		    gameCore.board.nodes.forEach(function(o, i) {
		      if(typeof o.foci !== "undefined"){
		        o.y += (gameCore.board.foci[o.foci].y - o.y) * k;
		        o.x += (gameCore.board.foci[o.foci].x - o.x) * k;
		      }
		    });

		    // Exit any old gameCore.board.nodes.
		    gameCore.board.activeNodes.exit().remove();

		    // Exit any old links
		    gameCore.board.activeLinks.exit().remove();

		    gameCore.board.activeNodes
		      .attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; })


		    gameCore.board.activeLinks
		      .attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; })
        },
        refresh: function(){

		    gameCore.board.activeLinks = gameCore.board.activeLinks.data(gameCore.board.links);
		    gameCore.board.activeLinks.enter().insert("line", ".node")
		      .attr("class", "link");


		    gameCore.board.activeNodes = gameCore.board.activeNodes.data(gameCore.board.nodes);
		    gameCore.board.activeNodes.enter().append("circle")
		      .attr("class", function(d) { return "id" + d.id + " node" })
		      .attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; })
		      .attr("r", 10)
		      .style("fill", function(d) { return (!d.antimuon) ? d3.rgb(95,173,65) :  d3.rgb(84,144,204); })
		      .call(gameCore.board.d3force.drag)

		    gameCore.board.d3force.start()
		},
		moveMuonTweenFoci: function(f1,f2){
		  gameCore.board.nodes.forEach(function(o, i) {
		    if (o.foci == f1){
		      o.foci = f2;
		    }
		  });

		  gameCore.board.refresh();
		}        

	},

	// Determines if the move the player wishes to perform is a valid one
	// Assumes that the move is passed in the form of bits
	ValidMove: function(from, to) {
		// Retrieve the positions adjecent to the selectied piece
		var quad = convert.bitToQuad(from);
		var node = convert.bitToNode(from);
		var openPositions = this.GetAvailableMoves(quad, node);
		console.log("Open positions: " + this.dec2bin(openPositions));

		// Return if the move selected is both adjacent to the selected piece, and free from other pieces
		// console.log(this.dec2bin(from));
		// console.log(this.dec2bin(to));
		// console.log(this.dec2bin(openPositions & to));
		return (openPositions & to) > 0;
	},

	GetAvailableMoves: function(quad, node) {
		var temp = evaluation.nodeConnections[quad][node];
		// console.log("Adjacent positions: " + this.dec2bin(temp));
		// console.log("Player 1 positions: " + this.dec2bin(this.p1Pos));
		// console.log("Player 2 positions: " + this.dec2bin(this.p2Pos));
		// console.log("    " + this.dec2bin(~(this.p1Pos | this.p2Pos) & temp));
		return ~(this.p1Pos | this.p2Pos) & temp;
	},

	// Moves a piece from one position to another
	// Assumes that the move is passed in the form of 0-19
	AttemptMove: function(from, to) {
		var bitFrom = convert.intToBit(from);
		var bitTo = convert.intToBit(to);
		var inputFrom =  convert.bitToStandard(bitFrom);
		var inputTo = convert.bitToStandard(bitTo);

		// Test to see if move human wants to perform is valid
		if (this.ValidMove(bitFrom, bitTo)) {
			console.log("Player moved from " + inputFrom + " to " + inputTo);

			// Perform move that human made
			this.p1Pos = (this.p1Pos ^ bitFrom) | bitTo;
			this.moveHistory.push(new Move(from, to, "player"));
			this.player1Turn = false;
			gameCore.board.moveMuonTweenFoci(from, to);
			display.displayBoard(this.p1Pos, this.p2Pos);

			if (this.GameOver()) {
				this.EndGame();
			}
			else {
				// Start a timer so the AI move is not immediate
				var timer = Date.now();
				// Retrieve AI move
				var aiMove = makeMoveAgainstAI(inputFrom, inputTo);
				debugger;
				timer = Date.now() - timer;
				//this.p2Pos = (this.p2Pos ^ aiMove[0]) | aiMove[1];
				//moveHistory.push(new Move(aiMove[0], aiMove[1], "opponent"));
				//console.log("Opponent moved from " + aiMove[0] + " to " + aiMove[1]);
				gameCore.board.moveMuonTweenFoci(aiMove.start, aiMove.end);
				display.displayBoard(this.p1Pos, this.p2Pos);
				this.player1Turn = true;
			}
		}
		else {
			console.log("Player attempted an invalid move, from " + inputFrom + " to " + inputTo);
		}
	},

	// Updates the flag for whether or not player 1 can create triangles in their starting quad
	ChangePlayer1Flag: function(status) {
		this.playerOneFlag = status;
	},

	// Updates the flag for whether or not player 2 can create triangles in their starting quad
	ChangePlayer2Flag: function(status) {
		this.playerTwoFlag = status;
	},

	// Returns 'P' for player won, 'O' for opponent won, and 'N' for no winner
	GameOver: function() {
		var over = false;

		//...

		return over;
	},

	// Sets the game board to not be able to be interfered wiith by the player
	EndGame: function() {
		// Lock the board from player input
	},

	dec2bin: function(dec) {
    	return dec.toString(2);
	},
};