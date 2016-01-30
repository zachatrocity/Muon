var AI = function() {
	var p2_Position = 0b00000111110000000000 //Always the other player
	var p1_Position = 0b00000000001111100000 //Always the AI
	// var p2_Position = 0b00000111000000000000 //Always the other player
	// var p1_Position = 0b00000000001011000000 //Always the AI
	var BITMASK = 0xFFFFF;
	var p1Flag = true
	var p2Flag = true
	var tempP1Flag = true;
	var tempP2Flag = true;

	this.makeMoveAgainstAI = function (start, end){
		var moveStart = convert.inputToBit(start);
		var moveEnd = convert.inputToBit(end);

		var open = p1_Position^p2_Position^BITMASK
		//If the player picked a valid move then make that move and call the AI to choosee a counter move.
	 	if(moveStart&p2_Position && moveEnd&boardAspect.openPositionsAroundPeice(moveStart,open)){
	 		p2_Position ^= moveStart^moveEnd;
	 		this.buildMoveTree(8);
	 	}
	 	else
	 		console.log("invalidMove")
	}

	//buildMoveTree()
		//This function is the beginning of the minimax process. The reason this is required is
		//because a minimax algorithm only returns the value of the best move and not the actual move.
		//buildMoveTree does a seperate minimax search on each of the first moves. The one that
		//returns the highest value should be the move that is made.
	this.buildMoveTree = function(depth){
		var bestScoreSoFar = -Infinity;
		var playersPeices = p1_Position; // make a copy of the AI's peices
		var bestMove;
		// loop through each peice on the AI board copy.
		for(var peice = bitManip.getLSB(playersPeices); playersPeices != 0; peice = bitManip.getLSB(playersPeices)){
			var open = (p1_Position^p2_Position)^BITMASK;
			var moveOptions = boardAspect.openPositionsAroundPeice(peice,open);
			//loop through all the peices around that bit
			for(var openSpace = bitManip.getLSB(moveOptions); moveOptions != 0; openSpace = bitManip.getLSB(moveOptions)){
				var bitBoardCopy = p1_Position^peice^openSpace
				var isWin = evaluation.Win(bitBoardCopy, 1, p1Flag, p2Flag);
				var score = isWin ? 1000 : this.alphaBeta(2, depth-1, bestScoreSoFar, Infinity, p2_Position, bitBoardCopy, false)
				if(score > bestScoreSoFar){
					bestScoreSoFar = score;
					bestMove = openSpace^peice;
				}
				//remove the last space checked from the list of open moves.
				moveOptions^=openSpace
			}

			//remove the last peice from the list of peices that need to be checked.
			playersPeices^=peice
		}

		//Make the best move that was found in the for-loops and check to see if the AI flag needs to be removed.
		p1_Position ^= bestMove;
		display.displayBoard(p1_Position, p2_Position, p1Flag, p2Flag);
		if(p1Flag && evaluation.isHomeQuadEmpty(1,p1_Position)){
			evaluation.removeFlag(1)
		}
	}

	this.alphaBeta = function (player, depth, alpha, beta, bitBoard, opponentsBoard, maximizing){
		if(depth == 0){
			//Here we evaluate the state of the last player to make a move.
			return evaluation.stateValue(opponentsBoard, bitBoard, player^3);
		}
		var playersPeices = bitBoard;
		for(var peice = bitManip.getLSB(playersPeices); playersPeices != 0; peice = bitManip.getLSB(playersPeices)){
			var open = (bitBoard^opponentsBoard)^BITMASK;
			var moveOptions = boardAspect.openPositionsAroundPeice(peice, open);
			for(var openSpace = bitManip.getLSB(moveOptions); moveOptions != 0; openSpace = bitManip.getLSB(moveOptions)){
				var bitBoardCopy = bitBoard^peice^openSpace;

				var tf1 = tempP1Flag;
				var tf2 = tempP2Flag;
				if(player == 1 && tempP1Flag){
					tempP1Flag = !evaluation.isHomeQuadEmpty(1, bitBoardCopy);
				}else if(player == 2 && tempP2Flag){
					tempP2Flag = !evaluation.isHomeQuadEmpty(2, bitBoardCopy);
				}
				var isWin = evaluation.Win(bitBoardCopy, player, tempP1Flag, tempP2Flag);

				score = isWin ? 1000 : this.alphaBeta(player^3, depth-1, alpha, beta, opponentsBoard, bitBoardCopy, !maximizing) 
				if(maximizing == true){
					if(score > alpha){alpha = score;}
					if(score >= beta){return beta;}
					
				} else {
					if(score < beta){beta = score;}
					if(beta <= alpha){return alpha;}
				}

				tempP1Flag = tf1;
				tempP2Flag = tf2;
				//remove the option that was just checked from the list
				moveOptions^=openSpace;
			}

			//remove the peice that was just checked from the list
			playersPeices^=peice
		}
		return maximizing?alpha:beta;
	}
	display.displayBoard(p1_Position, p2_Position,p1Flag,p2Flag);
}