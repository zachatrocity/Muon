var p2_Position = 0b00000111110000000000 //Always the other player
var p1_Position = 0b00000000001111100000 //Always the AI

//If The AI makes the wrong move here the human will win
//test move makeMoveAgainstAI("b4","b1")
// var p2_Position = 0b00000011100000010001
// var p1_Position = 0b00000100000110101000

//The AI jumped on one of player 2's pieces
//test the move makeMoveAgainstAI("d3","d1")
// var p2_Position = 0b00010011000000000011
// var p1_Position = 0b00000000100111001000

//The next move makeMoveAgainstAI("d3","d4")
//caused the AI to make invalid moves
// var p1_Position = 0b00000100001000111000
// var p2_Position = 0b10000011000000000011

// The AI is about to make a win move
// var p2_Position = 0b00000111110000000000 //Always the other player
// var p1_Position = 0b10001000000110000001 //Always the AI

var BITMASK = 0xFFFFF;
display.displayBoard(p1_Position,p2_Position);

var AI = {
	'bestScore':-999999,
	'moveList':[],
	'maxDepth':-1,

	pvs:function(alpha, beta, depth, p1_board, p2_board, pNum){
		var p = (pNum == 1 ? p1_board : p2_board);
		if(evaluation.Win(p, pNum, true, true)){
			return -1000; // because of negation the caller gets back 1000
		}
		if(depth == 0)
			return -evaluation.stateValue(p1_board, p2_board, pNum);

		pNum ^= 3; // Change the player number
		var bSearchPv = true;
		var score;

		//Get and loop through all the players pieces.
		var allPieces = pNum == 1 ? p1_board : p2_board;
		for(var piece = bitManip.getLSB(allPieces); allPieces; piece = bitManip.getLSB(allPieces)){
			var allSpaces = p1_board^p2_board^BITMASK;
			var moves = boardAspect.availabeMoves(piece, allSpaces);

			//Get and loop through all the moves a piece can make.
			for(var nextMove = bitManip.getLSB(moves); moves; nextMove = bitManip.getLSB(moves)){

				//b1 and b2 are the temp values for each move made on a board(b)
				var b1 = (pNum == 1 ? p1_board^piece^nextMove : p1_board); 
				var b2 = (pNum == 2 ? p2_board^piece^nextMove : p2_board); 
				if(bSearchPv)
					score = -AI.pvs(-beta, -alpha, depth-1, b1, b2, pNum);
				else{
					score = -AI.pvs(-alpha-1, -alpha, depth-1, b1, b2, pNum);
					if(score > alpha)
						score = -AI.pvs(-beta, -alpha, depth-1, b1, b2, pNum);
				}
				if(score > beta)
					return beta;
				if(score > alpha){
					alpha = score;
					bSearchPv = false;
				}
				if(depth == AI.maxDepth)
					AI.moveList[(AI.moveList).length] = {start: piece, end: nextMove, value:score};

				moves ^= nextMove; //nextMove has been checked, remove it from moves
			}
			allPieces ^= piece; //piece has been checked, remove it from allPieces
		}
		return alpha;
	},
}

var updateBoardp2 = function(start, end){
	p2_Position ^= start^end;
	saveData.saveMove(convert.bitToStandard(start),convert.bitToStandard(end), 2);
}

var updateBoardp1 = function(start, end){
	p1_Position ^= start^end;
	saveData.saveMove(convert.bitToStandard(start),convert.bitToStandard(end), 1);
	AI.bestScore = -999999;
	AI.moveList = [];
	display.displayBoard(p1_Position,p2_Position);
	printData.showBitBoards(p1_Position,p2_Position);
}

var makeMoveAgainstAI = function(start, end){
	var moveStart = convert.inputToBit(start);
	var moveEnd = convert.inputToBit(end);
	var depth = 7;
	AI.maxDepth = depth;

 	if( evaluation.validateMove(moveStart, moveEnd, p1_Position^p2_Position^BITMASK) ){
 		updateBoardp2(moveStart, moveEnd); // Human move
 		AI.pvs(-1000, 1000, depth, p1_Position, p2_Position, 2);

 		var bestIndex;
 		var bestScore = -Infinity;
 		console.log(AI.moveList)
 		for (var i = 0; i < (AI.moveList).length; i++) {
 			console.log("S:" + AI.moveList[i].start + " \tE:" + AI.moveList[i].end + " \tV:" + AI.moveList[i].value)
 			if(AI.moveList[i].value > bestScore){
 				bestScore = AI.moveList[i].value;
 				bestIndex = i;
 			}
 		}

 		var s = convert.bitToInt(AI.moveList[bestIndex].start)
 		var e = convert.bitToInt(AI.moveList[bestIndex].end)
 		updateBoardp1(AI.moveList[bestIndex].start, AI.moveList[bestIndex].end);
 		return { start: s, end: e };
 	
} 	else{
 		console.log("invalid Move");
 		return -1;
 	}
}