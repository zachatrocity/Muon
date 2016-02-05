var p2_Position = 0b00000111110000000000 //Always the other player
var p1_Position = 0b00000000001111100000 //Always the AI

var timeLimit = 5000; // 5 seconds
var BITMASK = 0xFFFFF;
var p1Flag = true
var p2Flag = true
var tempP1Flag = true;
var tempP2Flag = true;

display.displayBoard(p1_Position,p2_Position);

var AI = {
	pvs:function(alpha, beta, depth, p1_board, p2_board, pNum){
		if(timer.changeInTime() >= timeLimit){
			evaluation.stateValue(p1_board, p2_board, pNum);
		}
		var tempBoard = p1_board
		var score = -AI.pvs(-beta,-alpha,tempBoard,p2_board,pNum^0b11)
	}
}

var updateBoard = function(start, end, player){
	p2_Position ^= start^end;
	saveData.saveMove(convert.bitToStandard(start),convert.bitToStandard(end), player);
}

var makeMoveAgainstAI = function(start, end){
	var moveStart = convert.inputToBit(start);
	var moveEnd = convert.inputToBit(end);

 	if( evaluation.validateMove(moveStart, moveEnd, p1_Position^p2_Position^BITMASK) ){
 		updateBoard(moveStart, moveEnd, 2);
 		startTimer();
 		AI.pvs();
 	}
 	else
 		console.log("invalid Move")
}