var aiWorker = new Worker('./js/aiworker.js');

var Move = function(f, t, p) {
	this.from = f;
	this.to = t;
	this.player = p;
};

var gameCore = {
	p1Pos: 0b00000000001111100000, //Top left pieces
	p2Pos: 0b00000111110000000000, //Bottom right pieces
	playerOneFlag: true,
	playerTwoFlag: true,
	humanteam: '',

	player1Turn: true,	// Flag for the current player's turn
	MAX_HIST: 30,		// Maximum moves to keep track of
	moveHistory: [],	// A history of the moves made by both players
	winner: "none",		// To display if the local player won or lost
	gameOver: false,	// Stop allowing the selection of muons if true
	AIGoesFirst:false,
	AITreeDepth: 7,
	network: {
		team: '',
		turn: '',
		role: '',
		roomid: null,
		localFlag: true,
		localPos: '',
		localStartPos: '',
		opponentPos: '',
		opponentStartPos: '',
		opponentFlag: true,
		MakeOpponentMove: function(from, to){
			var bitFrom = convert.intToBit(from);
			var bitTo = convert.intToBit(to);
			console.log("opponent moved from " + convert.bitToStandard(bitFrom) + " to " + convert.bitToStandard(bitTo));

			// Update opponents bit board.
			gameCore.network.opponentPos ^= bitFrom ^ bitTo;
			gameCore.AddMoveToHistory(new Move(from, to, "opponent"));
			gameCore.board.moveMuonTweenFoci(from, to);

			//remove opponent flag if needed
			if(evaluation.isHomeQuadEmpty((gameCore.network.role == 'host') ? 2 : 1, gameCore.network.opponentPos))
				opponentFlag = false;


			if (gameCore.network.CheckForOpponentWin()) {
				gameCore.EndGame();
			}

		},
		CheckForOpponentWin: function() {
			player = (gameCore.network.role == 'host') ? 1 : 2;
			if (evaluation.Win(gameCore.network.opponentPos, player, gameCore.network.opponentFlag, gameCore.network.localFlag)) {
				gameCore.winner = player == 1 ? "lost" : "won";
				return true;
			} else {
				return false;
			}
		},
		CheckForLocalWin: function() {
			player = (gameCore.network.role == 'host') ? 2 : 1;
			if (evaluation.Win(gameCore.network.localPos, player, gameCore.network.opponentFlag, gameCore.network.localFlag)) {
				gameCore.winner = player == 1 ? "lost" : "won";
				return true;
			} else {
				return false;
			}
		}
	},
	board: {
		nodes: [],
		links: [],
		width: 700,
    	height: 700,
		foci: 	[{x: 0, y: 0},		{x: 285, y: 0},		//
        				{x: 140, y: 140},				// Quad A
				{x: 0, y: 285},		{x: 285, y: 285},	//

				{x: 415, y: 415},	{x: 700, y: 415},	//
        				{x: 560, y: 560},				// Quad D
				{x: 415, y: 700},	{x: 700, y: 700},	//
                
				{x: 415, y: 0},		{x: 700, y: 0},		//
      					{x: 560, y: 140},				// Quad B
				{x: 415, y: 285},	{x: 700, y: 285},	//
                
				{x: 0, y: 415},		{x: 285, y: 415},	//
         				{x: 140, y: 560},				// Quad C
				{x: 0, y: 700},		{x: 285, y: 700}],	//
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
			var maxFociDist = 80;

			if (gameCore.gameOver)
				return

			// This loops through all the nodes and finds the index of atleast one node within 30 to point
			if(gameCore.board.selectedMuon != null){
				//see if the click was near a foci
				gameCore.board.foci.forEach(function(target, index) {
					var x = target.x - point[0],
					    y = target.y - point[1],
					    distance = Math.sqrt(x * x + y * y);
					//check if the node (target) is within the maxdist of the click    
					if (distance < maxFociDist) {
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
					if(closestPoint > distance) {
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

            if(gameCore.network.roomid != null && closestNode){
                if(gameCore.network.team == gameCore.network.turn){ //my turn
	            	if(closestNode.antimuon == (gameCore.network.team == 'antimuon' ? 1 : 0)){
		                //select all the nodes around the node we clicked
		                var startIndex = closestNode.index - (closestNode.index % 3);
		                //closestNode.selected = true;
		                d3.selectAll(".id" + startIndex + ",.id" + (startIndex + 1) + ",.id" + (startIndex + 2))
		                    .transition()
		                    .duration(450)
		                    .attr("r", 15);

		                gameCore.board.selectedMuon = closestNode.foci;
                	}
                }
            } else if (closestNode && gameCore.BelongsToPlayer(gameCore.p2Pos, closestNode.foci)){

				//select all the nodes around the node we clicked
				var startIndex = closestNode.index - (closestNode.index % 3);
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

			gameCore.p1Pos = 0b00000000001111100000; //top left pieces
			gameCore.p2Pos = 0b00000111110000000000; //bottom right pieces
			gameCore.playerOneFlag = true;
			gameCore.playerTwoFlag = true;
			gameCore.player1Turn = true;
			gameCore.moveHistory = [];
			gameCore.gameOver = false;
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
		    if (o.foci == f1) {o.foci = f2;}
		  });

		  gameCore.board.refresh();
		}        
	},
	// Called when the player proposes a draw (ONLY TO THE AI)
	// Draws between networked players are determined if the other accepts
	ProposeDrawToAI: function() {
		if (gameCore.moveHistory.length >= gameCore.MAX_HIST)
			EndGame();
	},
	// Determines if the selected node belongs to the current player
	// This is so the player cannot select a piece that is not theirs
	BelongsToPlayer: function(player, selectedNode) {
		node = convert.intToBit(selectedNode);
		return (player & node) > 0;
	},
	// Determines if the move the player wishes to perform is a valid one
	// Assumes that the move is passed in the form of bits
	ValidMove: function(from, to) {
		// Retrieve the positions adjecent to the selectied piece
		var quad = convert.bitToQuad(from);
		var node = convert.bitToNode(from);
		var openPositions = gameCore.GetAvailableMoves(quad, node);
		console.log("Open positions: " + gameCore.dec2bin(openPositions));

		// Return if the move selected is adjacent to the selected piece, and free of other pieces.
		return (openPositions & to) >= 0;
	},
	// Adds the specified move to the history list.
	AddMoveToHistory: function(move) {
		if (gameCore.moveHistory.length < gameCore.MAX_HIST)
			gameCore.moveHistory.push(move);
		else {
			gameCore.moveHistory.shift();
			gameCore.moveHistory.push(move);
		}
	},
	GetAvailableMoves: function(quad, node) {
		var temp = evaluation.nodeConnections[quad][node];
		return ~(gameCore.p1Pos | gameCore.p2Pos) & temp;
	},
	// Moves a piece from one position to another
	// Assumes that the move is passed in the form of 0-19
	AttemptMove:function(from, to){
		var bitFrom = convert.intToBit(from);
		var bitTo = convert.intToBit(to);

		if (gameCore.ValidMove(bitFrom, bitTo)) {
			
			// If there is no room ID then you are playing against the AI.
			if(gameCore.network.roomid == null){
				console.log("Player moved from " + convert.bitToStandard(bitFrom) + " to " + convert.bitToStandard(bitTo));
				
				// Update the users bit board.
				gameCore.p2Pos ^= bitFrom ^ bitTo;
				gameCore.AddMoveToHistory(new Move(from, to, "player"));
				gameCore.player1Turn = true; //AIs turn is set to true
				gameCore.board.moveMuonTweenFoci(from, to);
				//display.displayBoard(gameCore.p1Pos, gameCore.p2Pos);
				if (gameCore.GameOver(gameCore.p2Pos)) {
					gameCore.EndGame();
				} else {
					// Make ai move
					aiWorker.postMessage({ 'from': bitFrom, 'to': bitTo });
				}
			} 
			// If there is a room ID then you are playing over network.
			else if(gameCore.network.turn == gameCore.network.team) { // If it's the the users turn.
				console.log("Player moved from " + convert.bitToStandard(bitFrom) + " to " + convert.bitToStandard(bitTo));
				
				// Update the users bit board.
				gameCore.network.localPos ^= bitFrom ^ bitTo;
				gameCore.board.moveMuonTweenFoci(from, to);
				//remove my flag if needed
				if(evaluation.isHomeQuadEmpty((gameCore.network.role == 'host') ? 2 : 1, gameCore.network.localPos))
					localFlag = false;

				cloak.message('turnDone', [from, to]);
				if (gameCore.network.CheckForLocalWin(gameCore.network.localPos)) {
					gameCore.EndGame();
				}
			} else {
				console.log("it is not your turn idiot.");
			}
		} else {
			console.log("Player attempted an invalid move, from " + bitFrom + " to " + bitTo);
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
	GameOver: function(position) {
		player = (position == gameCore.p1Pos ? 1 : 2);
		if (evaluation.Win(position, player, gameCore.playerOneFlag, gameCore.playerTwoFlag)) {
			gameCore.winner = player == 1 ? "lost" : "won";
			return true;
		} else {
			return false;
		}
	},
	RestartGame: function(isNetworkGame, role) {
		gameCore.board.clearBoard();
	 	gameCore.board.createBoard();	

	 	if(isNetworkGame){
	 		if(gameCore.network.role == 'host'){
	 			//then i'm the bottom right peices
	 			gameCore.network.localPos = gameCore.network.localStartPos = 0b00000111110000000000;
	 			//my opponent is up top
	 			gameCore.network.opponentPos = gameCore.network.opponentStartPos = 0b00000000001111100000;
	 		} else if(gameCore.network.role =='client'){
	 			//then i'm the top peices
	 			gameCore.network.localPos = gameCore.network.localStartPos = 0b00000000001111100000;
	 			//my opponent is below
	 			gameCore.network.opponentPos = gameCore.network.opponentStartPos = 0b00000111110000000000;
	 		}
	 	} else {
	 		aiWorker.postMessage(
			{ 
				'restart': true,
				'AIStarts': gameCore.AIGoesFirst,
				'depth': gameCore.AITreeDepth
			});
	 	}
	},
	//EndGame sets the game board to not be able to be interfered with by the player.
	EndGame: function() {
		gameCore.gameOver = true;	// Lock the board from player input
		if (gameCore.winner == "won") {
			console.log("YOU WON!");
			BoardGUI.showWinModal();
		}
		else if (gameCore.winner == "lost"){
			console.log("YOU LOST!");
			BoardGUI.showLoseModal();
		}
		else
			console.log("IT'S A TIE!");
	},
	dec2bin: function(dec) {
    	return dec.toString(2);
	},
};

aiWorker.onmessage = function(e) {
	console.log('Message received from worker');
	gameCore.p1Pos ^= (convert.intToBit(e.data.from)) ^ (convert.intToBit(e.data.to));
	gameCore.AddMoveToHistory(new Move(e.data.from, e.data.to, "ai"));
	gameCore.player1Turn = false; //human turn
	gameCore.board.moveMuonTweenFoci(e.data.from, e.data.to);

	if (gameCore.GameOver(gameCore.p1Pos)) {
		gameCore.EndGame();
	}
};