var p2_Position = 0b00000111110000000000 //Always the other player
var p1_Position = 0b00000000001111100000 //Always the AI

var timeLimit = 5000; // 5 seconds
var BITMASK = 0xFFFFF;
var p1Flag = true
var p2Flag = true
var tempP1Flag = true;
var tempP2Flag = true;

display.displayBoard(p1_Position,p2_Position);


//if(){

var AI = {
	'bestMove':0,
	'bestScore':0,
	'transposition':[],
	'alphaPrime':-Infinity,
	'betaPrime':Infinity,

	pvs:function(alpha, beta, depth, p1_board, p2_board, pNum){
		if(depth == 0){
			return evaluation.stateValue(p1_board, p2_board, pNum);
		}
		pNum ^= 3; // Change the player number
		var bSearchPv = true;
		var allPeices = pNum == 1 ? p1_board : p2_board;
		for(var peice = bitManip.getLSB(allPeices); allPeices; peice = bitManip.getLSB(allPeices)){
			var allSpace = p1_board^p2_board^BITMASK;
			var moves = boardAspect.availabeMoves(peice, allSpace);
			for(var nextMove = bitManip.getLSB(moves); allSpace; nextMove = bitManip.getLSB(moves)){

				//These are the temp values for each move made
				var pb1 = (pNum == 1 ? p1_board^peice^nextMove : p1_board);
				var pb2 = (pNum == 2 ? p2_board^peice^nextMove : p2_board);
				var score;
				debugger;
				if(bSearchPv){
					score = -AI.pvs(-beta, -alpha, depth-1, pb1, pb2, pNum);
				}
				else{
					score = -AI.pvs(-alpha-1, -alpha, depth-1, pb1, pb2, pNum);
					if(score > alpha){
						score = -AI.pvs(-beta, -alpha, depth-1, pb1, pb2, pNum);
					}
				}

				if(score >= beta)
					return beta;
				if(score > alpha){
					alpha = score; //alpha acts like max in MiniMax
					bSearchPv = false;
				}

				moves ^= nextMove;
			}
			allPeices ^= peice;
		}

		var score = -AI.pvs(-beta,-alpha,tempBoard,p2_board,pNum^0b11)
	},

	ideepening:function(timeLimit){
		timer.startTimer();
		for(var i = 1; timer.changeInTime() < timeLimit; i++){
			AI.pvs(this.alphaPrime, this.betaPrime, i, p1_Position, p2_Position, 2);
		}
		console.log(this.bestMove);
	},
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
 		AI.ideepening(timeLimit);
 	}
 	else
 		console.log("invalid Move")
}