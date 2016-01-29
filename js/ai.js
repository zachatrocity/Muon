var AI = function() {
	var view = new display();
	var binary = new bitManip();

	var p2_Position = 0b00000111110000000000 //Always the other player
	var p1_Position = 0b00000000001111100000 //Always the AI

	var p1Flag = true
	var p2Flag = true
	var positionGenes = [10,50,30,50,40] //0,1,2,3,4
	var geneticScalar = 1
	var nodeConnections = [
		[0b00000000000000001110,0b00000000000001010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00000000000111000000,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00000011100000000000,0b00010101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b01110000000000000000,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	];


	this.getAvailableMoves = function (quad, node){
		var openPositions = p2_Position^p1_Position^0xFFFFF
		return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
	}

	//getAvailableMoves() 
		//This returns all the open positions around the piece you are wanting to check
		//The Input should be one bit in a bitBoard given quadrant 0-3 and piece 0-4
		//Example: The top left most corner (1,0) quadrant 1 and peice 0
		//returns: 0b0000000000011100000 that is (1,1) (1,2) and (1,3)
		// this.getAvailableMoves = function (quad, node){
		// 	var openPositions = p2_Position^p1_Position^0xFFFFF
		// 	return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
		// }

	//getAvaiableMovesAI()
		//board = p2_Position^p1_Position^1048575
		//This is for temporary recursion positions
	this.getOpenMoveAi = function (quad,node,openPositions){
		return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
	}

	//getAvaiableMovesAI()
		//board = p2_Position^p1_Position^1048575
		//This is for temporary recursion positions
	this.openPositionsAroundPeice = function(quad,node,openPositions){
		return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
	}

	//this.getQuad()
		//This returns a quadrant 0-3
		//position is a single bitBoard node
		//position = 0b00000001000000000000 returns quadrant 2
	this.getQuad = function (position){
		return position&0x1F?0:(position&0x3E0?1:(position&0x7C00?2:3))
	}

	//this.getNode()
		//returns a node 0-4
		//position is a single bitBoard node
		//position = 0b00000010000000000000 returns node 3
	this.getNode = function (position){
		return position&0x08421?0:(position&0x10842?1:(position&0x21084?2:(position&0x42108?3:4)))
	}

	//this.checkFlag()
		//return false or 0 if the flag should be removed.
	this.checkFlag = function (player,position){
		if(player == 1){
			return position&0x3E0
		}
		return position&0x7C00
	}

	this.removeFlag = function (player){
		if(player == 1)
			p1Flag = false;
		else
			p2Flag = false;
	}

	//bitBoard for the player and the quadrant number 0 to 3
	this.getQuadBits = function(bitBoard, quadrant){
		return bitBoard & (0x1F<<(5*quadrant));
	}

	this.stateValue = function(bitBoard, bitBoard2, player){
		var total = 0;
		total += this.stolenRealEstate(bitBoard, bitBoard2);
		total += this.Win(bitBoard, player);
		return total;
	}

	this.stolenRealEstate = function(bitBoard, bitBoard2){
		var stolenSpace = 0
		for(var peice = binary.getLSB(bitBoard); bitBoard!=0; peice = binary.getLSB(bitBoard)){
			var connections = nodeConnections[this.getQuad(peice)][this.getNode(peice)];
			var adjacentOpponentPeices = connections&bitBoard2;
			stolenSpace += binary.BitCount(adjacentOpponentPeices);
			bitBoard ^= peice;
		}
		return stolenSpace;
	}

	this.Win = function (bitBoard, player){
		var homeFlag = this.checkFlag(player,bitBoard);
		var i = 1;
		debugger;
		for(var quad = this.getQuadBits(bitBoard, i); i < 4; i++, quad = this.getQuadBits(bitBoard, i)){
			if(!(homeFlag || i == player) && (quad == 0b11100 || quad == 0b11010 || quad == 0b11001 || quad == 0b10110 
			|| quad == 0b10011 || quad == 0b01101 || quad == 0b01011 || quad == 0b00111))
				return 1000;
		}
		return 0;
	}

	//performMoveHvsAI() 
		//This takes the peices starting position and tries to move it to an ending position.
		//
	this.performMoveHvsAI = function (startQuad, startNode, endQuad, endNode){
		var startPosition = (1<<(startQuad*5 + startNode))
		var endPosition = (1<<(endQuad*5 + endNode))

	 	if(startPosition&p2_Position && endPosition&this.getAvailableMoves(startQuad, startNode)){
	 		p2_Position ^= startPosition^endPosition;
	 		view.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
	 		var t1 = Date.now();
	 		this.performAiMoveABDF(1);
	 		//IDDFSStart(1);
	 		var t2 = Date.now();
	 		console.log((t2-t1)/1000)
	 		view.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
	 	}
	 	else
	 		console.log("invalidMove")
	}

	this.performAiMoveABDF = function(depth){
		var max = -Infinity;
		var tempBoard = p1_Position;
		var bestMove;

		for(var peice = binary.getLSB(tempBoard); tempBoard != 0; tempBoard^=peice){
			var open = p1_Position^p2_Position^0xFFFFF;
			var openMoves = this.openPositionsAroundPeice(this.getQuad(peice), this.getNode(peice),open);
			for(var nextSpace = binary.getLSB(openMoves); openMoves != 0; openMoves^=nextSpace){
				var bitBoardCopy = p1_Position^peice^nextSpace
				var score = this.alphaBeta(2, depth-1, max, Infinity, p2_Position, bitBoardCopy, nextSpace, false)
				if(score > max){
					max = score;
					bestMove = nextSpace^peice;
				}
				nextSpace = binary.getLSB(openMoves);
			}
			peice = binary.getLSB(tempBoard);
		}
		p1_Position ^= bestMove;
		if(p1Flag && !this.checkFlag(1,p1_Position)){
			this.removeFlag(1)
		}
	}

	this.performAiMove = function (depth){
		var max = -Infinity;
		var tempBoard = p1_Position;
		var bestMove;

		var peice = binary.getLSB(tempBoard);
		while(tempBoard != 0){
			var openMoves = this.getOpenMoveAi(this.getQuad(peice), this.getNode(peice),p1_Position^p2_Position^0xFFFFF);
			var nextSpace = binary.getLSB(openMoves);
			while( openMoves != 0){
				var bitBoardCopy = p1_Position^peice^nextSpace
				var score = this.alphaBeta(2, depth-1, max, Infinity, p2_Position, bitBoardCopy, nextSpace, false)
				if(score > max){
					max = score;
					bestMove = nextSpace^peice;
				}
				openMoves^=nextSpace;
				nextSpace = binary.getLSB(openMoves);
			}
			tempBoard^=peice;
			peice = binary.getLSB(tempBoard);
		}
		p1_Position ^= bestMove;
		if(p1Flag && !this.checkFlag(1,p1_Position)){
			this.removeFlag(1)
		}
	}

	//this.alphaBeta()
		//this.alphaBeta only returns the value of a move, not the actual move that should be made.
		//player--------can be a 1 or a 2
		//depth---------how far in the tree you would like to go
		//a-------------should start at -infinity
		//b-------------should start at infinity
		//bitBoard------the current players board state
		//bitBoard2-----the other players state
		//move----------the last move that was made (a single binary peice)
		//maximizing----if the player is maximizing then this is TRUE, else FALSE
	this.alphaBeta = function (player, depth, alpha, beta, bitBoard, bitBoard2, space, maximizing){
		if(depth == 0){
			return this.stateValue(bitBoard2, bitBoard, player^3);
		}
		var tempBoard = bitBoard;
		for(var peice = binary.getLSB(tempBoard); tempBoard != 0; peice = binary.getLSB(tempBoard)){
			var openMoves = this.openPositionsAroundPeice(this.getQuad(peice), this.getNode(peice),bitBoard^bitBoard2^0xFFFFF);
			for(var nextSpace = binary.getLSB(openMoves); openMoves != 0; nextSpace = binary.getLSB(openMoves)){
				var bitBoardCopy = bitBoard^peice^nextSpace
				score = this.alphaBeta(player^3, depth-1, alpha, beta, bitBoard2, bitBoardCopy, nextSpace, !maximizing)
				//Win(bitBoardCopy, getQuad(nextSpace), player) ? Infinity : 
				if(maximizing == true){
					if(score >= beta){return beta;}
					if(score > alpha){alpha = score;}
				} else {
					if(score <= alpha){return alpha;}
					if(score < beta){beta = score;}
				}
				openMoves^=nextSpace;
			}
			tempBoard^=peice
		}
		return maximizing?alpha:beta;
	}
	view.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
}