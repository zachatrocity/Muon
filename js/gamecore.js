var aiWorker = new Worker('./js/aiworker.js');

var Move = function(f, t, p) {
	this.from = f;
	this.to = t;
	this.player = p;
};

// An object that holds all the logic associated with running the gamecore
var gameCore = {
	
	p1Pos: 0b00000000001111100000, 	//Always the AI
	// The initial position of player 2 (the opponent)
	p2Pos: 0b00000111110000000000, //HUMAN
	// The flags for P1 and P2 for if they can can create a triangle in their starting quadrant
	playerOneFlag: true,
	playerTwoFlag: true,
	// Flag for the current player's turn
	player1Turn: true,
	// A list of the past ~10 move that the player/opponet have made (5 ea.)
	moveHistory: [],
	team: '',
	turn: '',
	roomid: null,

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
                         {x: 150, y: 550},            // Quad C
                {x: 5, y: 675}, {x: 300, y: 675}],   //
        boardSVG: null,
        d3force: null,
        activeNodes: null,
        activeLinks: null,
        selectedMuon: null,
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
        mousedown: function() {
			var point = d3.mouse(this);
			var maxdist = 30
			var maxFociDist = 60;
			// This loops through all the nodes and find the index of atleast one node within
			// 30 to point

			if(gameCore.board.selectedMuon != null){
				//see if the click was near a foci
				gameCore.board.foci.forEach(function(target, index) {
					var x = target.x - point[0],
					    y = target.y - point[1],
					    distance = Math.sqrt(x * x + y * y);
					//check if the node (target) is within the maxdist of the click    
					if (distance < maxFociDist) {
						//click was close to a foci
						//move gameCore.board.selectedMuon toward this target (foci)
						gameCore.AttemptMove(gameCore.board.selectedMuon,index);
					} 
				});
			}

			var closestNode; //used to store the node closest to the click
			var closestPoint = Infinity; //used to compare the distance between closestNode and other nodes
			//loop though all of the nodes
			gameCore.board.nodes.forEach(function(target) {
				var x = target.x - point[0],
				    y = target.y - point[1],
				    distance = Math.sqrt(x * x + y * y);
				//check if the node (target) is within the maxdist of the click    
				if (distance < maxdist) {
					//if target is closer than my currently stored closestNode then replace it with target
					if(closestPoint > distance)
					{
						closestNode = target;
						closestPoint = distance;
					}
				} else {
					//unselect all other nodes
					target.selected = false;
					d3.selectAll(".id" + target.index).transition().duration(450).attr("r", 10);
					gameCore.board.selectedMuon = null;
				}
			});

			if(closestNode){
				//select all the nodes around the node we clicked
				var startIndex = closestNode.index - (closestNode.index % 3);
				//closestNode.selected = true;
				d3.selectAll(".id" + startIndex + ",.id" + (startIndex + 1) + ",.id" + (startIndex + 2))
					.transition()
					.duration(450)
					.attr("r", 15);

				gameCore.board.selectedMuon = closestNode.foci;
			}
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
		createBoard: function(){
			gameCore.board.boardSVG = d3.select(".gamepeices").append("svg")
				.attr("class", "d3gamepeices")
			    .attr("width", gameCore.board.width)
			    .attr("height", gameCore.board.height)
			    .on("mousedown", gameCore.board.mousedown);

			gameCore.board.d3force = d3.layout.force()
			    .nodes(gameCore.board.nodes)
			    .links(gameCore.board.links)
			    .linkDistance(50)
			    .linkStrength(1)
			    .gravity(0.02)
			    .charge(function(d, i) { 
			      return d.id % 3 == 0 ? -30 : 0; 
			    })
			    .size([gameCore.board.width, gameCore.board.height])
			    .on("tick", gameCore.board.tick)
			    
			gameCore.board.activeNodes = gameCore.board.boardSVG.selectAll("circle");
			gameCore.board.activeLinks = gameCore.board.boardSVG.selectAll('.link');
			gameCore.board.addMuons();
			gameCore.board.addAntiMuons();
		},
		clearBoard: function(){
			if(gameCore.board.d3force != null){
				gameCore.board.d3force.stop();
				d3.select(".d3gamepeices").remove();
			}

			gameCore.board.nodes = [];
			gameCore.board.links = [];
			gameCore.board.boardSVG = null;
			gameCore.board.d3force = null;
			gameCore.board.activeNodes = null;
			gameCore.board.activeLinks = null;
			gameCore.board.selectedMuon = null;

			gameCore.p1Pos = 0b00000000001111100000; 	//Always the AI
			// The initial position of player 2 (the opponent)
			gameCore.p2Pos = 0b00000111110000000000;
			gameCore.playerOneFlag = true;
			gameCore.playerTwoFlag = true;
			gameCore.player1Turn = true;
			gameCore.moveHistory = [];
		},
		addNodeAtFoci: function(f,anti){
		    var i = f * 3

		    gameCore.board.nodes.push({id: i, foci: f, antimuon: anti, selected: false});
		    gameCore.board.nodes.push({id: i + 1, foci: f, antimuon: anti, selected: false});
		    gameCore.board.links.push({source: i, target: i + 1});
		    gameCore.board.nodes.push({id: i + 2, foci: f, antimuon: anti, selected: false});
		    gameCore.board.links.push({source: i + 2, target: i + 1});
		    gameCore.board.links.push({source: i, target: i + 2});

		    gameCore.board.refresh();
		},
		addMuons: function(){
			gameCore.board.addNodeAtFoci(0,1);
			gameCore.board.addNodeAtFoci(1,1);
			gameCore.board.addNodeAtFoci(2,1);
			gameCore.board.addNodeAtFoci(3,1);
			gameCore.board.addNodeAtFoci(4,1);
		},
		addAntiMuons: function(){
			gameCore.board.addNodeAtFoci(5,0);
			gameCore.board.addNodeAtFoci(6,0);
			gameCore.board.addNodeAtFoci(7,0);
			gameCore.board.addNodeAtFoci(8,0);
			gameCore.board.addNodeAtFoci(9,0);
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
		var openPositions = gameCore.GetAvailableMoves(quad, node);
		console.log("Open positions: " + gameCore.dec2bin(openPositions));

		// Return if the move selected is both adjacent to the selected piece, and free from other pieces
		// console.log(gameCore.dec2bin(from));
		// console.log(gameCore.dec2bin(to));
		// console.log(gameCore.dec2bin(openPositions & to));
		return (openPositions & to) > 0;
	},

	GetAvailableMoves: function(quad, node) {
		var temp = evaluation.nodeConnections[quad][node];
		// console.log("Adjacent positions: " + gameCore.dec2bin(temp));
		// console.log("Player 1 positions: " + gameCore.dec2bin(gameCore.p1Pos));
		// console.log("Player 2 positions: " + gameCore.dec2bin(gameCore.p2Pos));
		// console.log("    " + gameCore.dec2bin(~(gameCore.p1Pos | gameCore.p2Pos) & temp));
		return ~(gameCore.p1Pos | gameCore.p2Pos) & temp;
	},

	//USE ONLY FOR NETWORK MOVE
	MakeOpponentMove: function(from, to){ 
		var bitFrom = convert.intToBit(from);
		var bitTo = convert.intToBit(to);
		var inputFrom =  convert.bitToStandard(bitFrom);
		var inputTo = convert.bitToStandard(bitTo);
		console.log("opponent moved from " + inputFrom + " to " + inputTo);
		// Perform move
		gameCore.p1pos ^= bitFrom ^ bitTo;
		gameCore.moveHistory.push(new Move(from, to, "player"));
		gameCore.board.moveMuonTweenFoci(from, to);
	},

	// Moves a piece from one position to another
	// Assumes that the move is passed in the form of 0-19
	AttemptMove: function(from, to) {
		var bitFrom = convert.intToBit(from);
		var bitTo = convert.intToBit(to);
		var inputFrom =  convert.bitToStandard(bitFrom);
		var inputTo = convert.bitToStandard(bitTo);

		// Test to see if move human wants to perform is valid
		if (gameCore.ValidMove(bitFrom, bitTo)) {
			
			if(gameCore.roomid == null) //playing against ai
			{
				console.log("Player moved from " + inputFrom + " to " + inputTo);
				// Perform move
				gameCore.p2Pos ^= bitFrom ^ bitTo;
				gameCore.moveHistory.push(new Move(from, to, "player"));
				gameCore.player1Turn = true; //AIs turn
				gameCore.board.moveMuonTweenFoci(from, to);
				//display.displayBoard(gameCore.p1Pos, gameCore.p2Pos);

				if (gameCore.GameOver()) {
					gameCore.EndGame();
				}
				else {
					// Start a timer so the AI move is not immediate
					//var timer = Date.now();
					// Retrieve AI move
					aiWorker.postMessage(
						{ 
							'from': bitFrom,
							'to': bitTo
						});
				}
			} else { //playing over network
				debugger;
				if(gameCore.turn == gameCore.team){ //if it is even my turn
					console.log("Player moved from " + inputFrom + " to " + inputTo);
					// Perform move
					gameCore.p2Pos ^= bitFrom ^ bitTo;
					gameCore.board.moveMuonTweenFoci(from, to);
					cloak.message('turnDone', [from, to]);

				} else {
					console.log("it is not your turn idiot.");
				}
			}
		}
		else {
			console.log("Player attempted an invalid move, from " + inputFrom + " to " + inputTo);
		}
	},

	// Updates the flag for whether or not player 1 can create triangles in their starting quad
	ChangePlayer1Flag: function(status) {
		gameCore.playerOneFlag = status;
	},

	// Updates the flag for whether or not player 2 can create triangles in their starting quad
	ChangePlayer2Flag: function(status) {
		gameCore.playerTwoFlag = status;
	},

	// Returns 'P' for player won, 'O' for opponent won, and 'N' for no winner
	GameOver: function() {
		var over = false;

		//...

		return over;
	},

	RestartGame: function(isNetworkGame) {
		gameCore.board.clearBoard();
	 	gameCore.board.createBoard();	

	 	if(isNetworkGame){

	 	} else {
	 		aiWorker.postMessage(
			{ 
				'restart': true
			});
	 	}
	},

	// Sets the game board to not be able to be interfered wiith by the player
	EndGame: function() {
		// Lock the board from player input
		console.log("game over");
	},

	dec2bin: function(dec) {
    	return dec.toString(2);
	},
};

aiWorker.onmessage = function(e) {
	console.log('Message received from worker');
	
	gameCore.p1Pos ^= (convert.intToBit(e.data.from)) ^ (convert.intToBit(e.data.to));
	gameCore.moveHistory.push(new Move(e.data.from, e.data.to, "ai"));
	gameCore.player1Turn = false; //human turn
	gameCore.board.moveMuonTweenFoci(e.data.from, e.data.to);
};