var AI = function() {
	var p2_Position = 0b00000111110000000000 //Always the other player
	var p1_Position = 0b00000000001111100000 //Always the AI
	var BITMASK = 0xFFFFF;
	var p1Flag = true
	var p2Flag = true

	this.getAvailableMoves = function (quad, node){
		var openPositions = p2_Position^p1_Position^BITMASK
		return (openPositions&((1<<(quad*5 + node))|evaluation.nodeConnections[quad][node]));
	}
	//getAvaiableMovesAI()
		//board = p2_Position^p1_Position^1048575
		//This is for temporary recursion positions
	this.openPositionsAroundPeice = function(quad,node,openPositions){
		return (openPositions&((1<<(quad*5 + node))|evaluation.nodeConnections[quad][node]));
	}
	//this.checkFlag()
		//return false or 0 if the flag should be removed.
		//position is the board state of the player being checked.
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

	//performMoveHvsAI() 
		//This takes the peices starting position and tries to move it to an ending position.
		//
	this.performMoveHvsAI = function (startQuad, startNode, endQuad, endNode){
		var startPosition = (1<<(startQuad*5 + startNode))
		var endPosition = (1<<(endQuad*5 + endNode))

	 	if(startPosition&p2_Position && endPosition&this.getAvailableMoves(startQuad, startNode)){
	 		p2_Position ^= startPosition^endPosition;
	 		display.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
	 		var t1 = Date.now();
	 		this.performAiMoveABDF(2);
	 		//IDDFSStart(1);
	 		var t2 = Date.now();
	 		console.log((t2-t1)/1000)
	 		display.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
	 	}
	 	else
	 		console.log("invalidMove")
	}

	this.performAiMoveABDF = function(depth){
		var max = -Infinity;
		var tempBoard = p1_Position;
		var bestMove;

		for(var peice = bitManip.getLSB(tempBoard); tempBoard != 0; tempBoard^=peice){
			var open = p1_Position^p2_Position^BITMASK;
			var openMoves = this.openPositionsAroundPeice(boardAspect.getQuad(peice), boardAspect.getNode(peice),open);
			for(var nextSpace = bitManip.getLSB(openMoves); openMoves != 0; openMoves^=nextSpace){
				var bitBoardCopy = p1_Position^peice^nextSpace
				var score = this.alphaBeta(2, depth-1, max, Infinity, p2_Position, bitBoardCopy, nextSpace, false)
				if(score > max){
					max = score;
					bestMove = nextSpace^peice;
				}
				nextSpace = bitManip.getLSB(openMoves);
			}
			peice = bitManip.getLSB(tempBoard);
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

		var peice = bitManip.getLSB(tempBoard);
		while(tempBoard != 0){
			var openMoves = boardAspect.getOpenMovesFromTempBoard( boardAspect.getQuad(peice), boardAspect.getNode(peice), p1_Position^p2_Position^BITMASK);
			var nextSpace = bitManip.getLSB(openMoves);
			while( openMoves != 0){
				var bitBoardCopy = p1_Position^peice^nextSpace
				var score = this.alphaBeta(2, depth-1, max, Infinity, p2_Position, bitBoardCopy, nextSpace, false)
				if(score > max){
					max = score;
					bestMove = nextSpace^peice;
				}
				openMoves^=nextSpace;
				nextSpace = bitManip.getLSB(openMoves);
			}
			tempBoard^=peice;
			peice = bitManip.getLSB(tempBoard);
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
		//move----------the last move that was made (a single bitManip peice)
		//maximizing----if the player is maximizing then this is TRUE, else FALSE
	this.alphaBeta = function (player, depth, alpha, beta, bitBoard, bitBoard2, space, maximizing){
		if(depth == 0){
			return evaluation.stateValue(bitBoard2, bitBoard, player^3, space);
		}
		var tempBoard = bitBoard;
		for(var peice = bitManip.getLSB(tempBoard); tempBoard != 0; peice = bitManip.getLSB(tempBoard)){
			var openMoves = this.openPositionsAroundPeice(boardAspect.getQuad(peice), boardAspect.getNode(peice),bitBoard^bitBoard2^0xFFFFF);
			for(var nextSpace = bitManip.getLSB(openMoves); openMoves != 0; nextSpace = bitManip.getLSB(openMoves)){
				var bitBoardCopy = bitBoard^peice^nextSpace
				score = this.alphaBeta(player^3, depth-1, alpha, beta, bitBoard2, bitBoardCopy, nextSpace, !maximizing)
				//Win(bitBoardCboard getQuad(nextSpace), player) ? Infinity : 
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
	display.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
}