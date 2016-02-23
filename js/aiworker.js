var p1_Position = 0b00000000001111100000; //Always the AI
var p2_Position = 0b00000111110000000000; //Always the other player
var p1_flag = true;
var p2_flag = true;
var BITMASK = 0xFFFFF;

//For now this only stores losses
var transposition = {
	'table':[],
	add:function(b1,b2,f1,f2,p,score){
		var state = b1.toString(2) + b2.toString(2) + (f1?1:0) + (f2?1:0) + (p==1?0:1);
		transposition.table[state] = score;
	},
	get:function(b1,b2,f1,f2,p){
		var state = b1.toString(2) + b2.toString(2) + (f1 ? 1:0) + (f2 ? 1:0) + (p==1?0:1);
		if(transposition.table.indexOf(state) == -1)
			return false;
		return transposition.table[state];
	},
}

var boardAspect = {
	//bitBoard for the player and the quadrant number 0 to 3
	getQuadBits: function(bitBoard, quadrant){
		return (bitBoard >>> (5*quadrant)) & 0x1F;
	},

	//peice is a bit representation of any peice on the board.
	availabeMoves:function(peice,openPositions){
		var quad = convert.bitToQuad(peice)
		var node = convert.bitToNode(peice)
		return openPositions&evaluation.nodeConnections[quad][node];
	},
}

var convert = {
	bitToInt: function(position) {
		switch (position) {
			case 0b00000000000000100000 : return 0;
			case 0b00000000000001000000 : return 1;
			case 0b00000000000010000000 : return 2;
			case 0b00000000000100000000 : return 3;
			case 0b00000000001000000000 : return 4;
			case 0b00000100000000000000 : return 5;
			case 0b00000010000000000000 : return 6;
			case 0b00000001000000000000 : return 7;
			case 0b00000000100000000000 : return 8;
			case 0b00000000010000000000 : return 9;
			case 0b00000000000000000010 : return 10;
			case 0b00000000000000000001 : return 11;
			case 0b00000000000000000100 : return 12;
			case 0b00000000000000010000 : return 13;
			case 0b00000000000000001000 : return 14;
			case 0b01000000000000000000 : return 15;
			case 0b10000000000000000000 : return 16;
			case 0b00100000000000000000 : return 17;
			case 0b00001000000000000000 : return 18;
			case 0b00010000000000000000 : return 19;
			default: console.log("Cannot convert from int " + position + " to int");
		}
	},

	//quadNodeToBit()
	quadNodeToBit:function(quad, node){
		return 1<<(quad*5 + node);
	},

	//This returns a quadrant 0-3
	bitToQuad: function(position){
		return position&0x1F?0:(position&0x3E0?1:(position&0x7C00?2:3));
	},

	//returns a node 0-4
	bitToNode: function(position){
		return position&0x08421?0:(position&0x10842?1:(position&0x21084?2:(position&0x42108?3:4)));
	},
}

var bitManip = {
	//This function returns the number of 1's in a base 2 number.
	BitCount:function(n) { 
	    n = (n & 0x55555555) + ((n >> 1) & 0x55555555) ; 
	    n = (n & 0x33333333) + ((n >> 2) & 0x33333333) ; 
	    n = (n & 0x0f0f0f0f) + ((n >> 4) & 0x0f0f0f0f) ; 
	    n = (n & 0x00ff00ff) + ((n >> 8) & 0x00ff00ff) ; 
	    n = (n & 0x0000ffff) + ((n >> 16)& 0x0000ffff) ; 
	    return n ; 
	},

	//this takes any binary number and returns the least significant bit
	getLSB: function (binaryNumber){
		if(binaryNumber == 0){return 0xFFFFFFF;}
		leastSig = 0x80000000;
		if(binaryNumber&0x0000FFFF){ leastSig >>>=16; binaryNumber &= 0x0000FFFF;}
		if(binaryNumber&0x00FF00FF){ leastSig >>>= 8; binaryNumber &= 0x00FF00FF;}
		if(binaryNumber&0x0F0F0F0F){ leastSig >>>= 4; binaryNumber &= 0x0F0F0F0F;}
		if(binaryNumber&0x33333333){ leastSig >>>= 2; binaryNumber &= 0x33333333;}
		if(binaryNumber&0x55555555){ leastSig >>>= 1;}
		return leastSig;
	}
}

var evaluation = {
	//Normal connections
	'nodeConnections':[
		[0b00000000000000001110,0b00000000000001010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00000000000111000000,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00000011100000000000,0b00010101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b01110000000000000000,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	],

	//return true if the players home quadrant is empty.
	isHomeQuadEmpty:function(bitBoard, player){
		if(player == 2 && (bitBoard&0b111110000000000) == 0)
			return true;
		if(player == 1 && (bitBoard&0b1111100000) == 0)
			return true;
		return false;
	},

	stateValue:function(bitBoard, bitBoard2, f1, f2, player){
		var total = 0;
		var currentBitBoard = (player == 1 ? bitBoard : bitBoard2);
		total += this.stolenRealEstate(bitBoard, bitBoard2);
		// total += this.isHomeQuadEmpty(bitBoard, player) ? 5 : -1;
		total += this.isHomeQuadEmpty(bitBoard2, player^3) ? -5 : 1;
		return total;
	},

	stolenRealEstate:function(bitBoard, bitBoard2){
		var stolenSpace = 0
		for(var peice = bitManip.getLSB(bitBoard); bitBoard!=0; peice = bitManip.getLSB(bitBoard)){
			var connections = this.nodeConnections[convert.bitToQuad(peice)][convert.bitToNode(peice)];
			var adjacentOpponentPeices = connections&bitBoard2;
			stolenSpace += bitManip.BitCount(adjacentOpponentPeices);
			bitBoard ^= peice;
		}
		return stolenSpace;
	},

	Win:function(bitBoard, player, f1, f2){
		var homeFlag = player == 1  ? f1 : f2;
		var quad = boardAspect.getQuadBits(bitBoard, 0);
		if(!(quad == 14 || quad == 21) && bitManip.BitCount(quad) >= 3)
			return true;
		quad = boardAspect.getQuadBits(bitBoard, 1);
		if(!(homeFlag && player == 1) && !(quad == 14 || quad == 21) && bitManip.BitCount(quad) >= 3)
			return true;
		quad = boardAspect.getQuadBits(bitBoard, 2);
		if(!(homeFlag && player == 2) && !(quad == 14 || quad == 21) && bitManip.BitCount(quad) >= 3)
			return true;
		quad = boardAspect.getQuadBits(bitBoard, 3);
		if(!(quad == 14 || quad == 21) && bitManip.BitCount(quad) >= 3)
			return true;
		return false;
	},
}

var AI = {
	'currentMoveOptions':[],
	'nextMoveOption':[],
	'bestMovePredicted':[],
	'maxDepth':-1,
	'bSearchPv':true,

	DeepPVSAI:function(alpha, beta, depth, p1_board, p2_board, f1, f2){
		//Check for a win condition. If the win is close to the top of the tree it's worth more.
		if(evaluation.Win(p2_board, 2, f1, f2))
			return ~(100 * (depth + 1)) + 1;
		if(depth == 0)
			return ~(evaluation.stateValue(p1_board, p2_board, f1, f2, 2)) + 1

		//Get and loop through all the players pieces.
		var allPieces = p1_board;
		var allSpaces, moves, b1, score, piece, nextMove;

		for(piece = bitManip.getLSB(allPieces); allPieces != 0; piece = bitManip.getLSB(allPieces)){
			allSpaces = p1_board^p2_board^BITMASK;
			moves = boardAspect.availabeMoves(piece, allSpaces);

			//Get and loop through all the moves a piece can make.
			for(nextMove = bitManip.getLSB(moves); moves != 0; nextMove = bitManip.getLSB(moves)){
				b1 = p1_board^piece^nextMove;
				f1 = f1 ? !evaluation.isHomeQuadEmpty(b1,1) : f1
				if(AI.bSearchPv)
					score = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, p2_board, f1, f2);
				else{
					score = -AI.DeepPVSHU(~alpha, ~alpha+1, depth-1, b1, p2_board, f1, f2);
					if(score > alpha)
						score = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, p2_board, f1, f2);
				}

				// if(depth == AI.maxDepth - 2){ // Setup bestfirst search move options.
				// 	var state = 'x' + p2_board + 'y' + p1_board
				// 	AI.nextMoveOption[state] = AI.nextMoveOption[state] || {'start':piece, 'end':nextMove, 'score':score};
				// 	if(AI.nextMoveOption[state].score < score){
				// 		AI.nextMoveOption[state] = {'start':piece, 'end':nextMove, 'score':score}
				// 	}
				// }

				if(score >= beta)
					return beta;
				if(score > alpha){
					alpha = score;
					AI.bSearchPv = false;
				}
				moves ^= nextMove;
			}
			allPieces ^= piece;
		}
		return alpha;
	},

	DeepPVSHU:function(alpha, beta, depth, p1_board, p2_board, f1, f2){
		//Check for a win condition. If the win is close to the top of the tree it's worth more.
		if(evaluation.Win(p1_board, 1, f1, f2))
			return ~(100 * (depth + 1)) + 1;
		if(depth == 0)
			return ~(evaluation.stateValue(p1_board, p2_board, f1, f2, 1)) + 1

		//Get and loop through all the players pieces.
		var allPieces = p2_board;
		var piece, allSpaces, moves, nextMove, b2, score;
		for(piece = bitManip.getLSB(allPieces); allPieces != 0; piece = bitManip.getLSB(allPieces)){
			allSpaces = p1_board^p2_board^BITMASK;
			moves = boardAspect.availabeMoves(piece, allSpaces);

			//Get and loop through all the moves the piece can make.
			for(nextMove = bitManip.getLSB(moves); moves != 0; nextMove = bitManip.getLSB(moves)){
				b2 = p2_board^piece^nextMove;
				f2 = f2 ? !evaluation.isHomeQuadEmpty(b2, 2) : f2
				if(AI.bSearchPv)
					score = -AI.DeepPVSAI(~beta+1, ~alpha+1, depth-1, p1_board, b2, f1, f2);
				else{
					score = -AI.DeepPVSAI(~alpha, ~alpha+1, depth-1, p1_board, b2, f1, f2);
					if(score > alpha)
						score = -AI.DeepPVSAI(~beta+1, ~alpha+1, depth-1, p1_board, b2, f1, f2);
				}
				if(score >= beta)
					return beta;
				if(score > alpha){
					alpha = score;
					AI.bSearchPv = false;
				}
				moves ^= nextMove;
			}
			allPieces ^= piece;
		}
		AI.bSearchPv = true;
		return alpha;
	},

	pvs:function(alpha, beta, depth, p1_board, p2_board){
		var allPieces = p1_board;
		var piece, moves, nextMove, b1,f1,score;

		//var piece = AI.bestMovePredicted.move || false;
		// if(piece){
		// 	b1 = p1_board^piece;
		// 	f1 = (evaluation.isHomeQuadEmpty(b1, 1) ? false : true);
		// 	alpha = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, p2_board, f1, p2_flag);
		// 	AI.currentMoveOptions[0] = {start: piece&p1_board, end: ~p1_board&piece, value:alpha};
		// 	allPieces = (~piece)&p1_board;
		// }

		//loop through all the AIs pieces
		for(piece = bitManip.getLSB(allPieces); allPieces != 0; piece = bitManip.getLSB(allPieces)){
			moves = boardAspect.availabeMoves(piece, (p1_board^p2_board^BITMASK));

			//loop through all the moves that piece can make.
			for(nextMove = bitManip.getLSB(moves); moves != 0; nextMove = bitManip.getLSB(moves)){

				b1 = p1_board^piece^nextMove;
				f1 = p1_flag ? !evaluation.isHomeQuadEmpty(b1, 1) : p1_flag;
				
				score = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, p2_board, f1, p2_flag);

				AI.currentMoveOptions[(AI.currentMoveOptions).length] = {start: piece, end: nextMove, value:score};
				// if(score >= beta)
				// 	return beta;
				// if(score > alpha){
				// 	alpha = score;
				// 	AI.bSearchPv = false;
				// }
				moves ^= nextMove
			}

			allPieces ^= piece
		}
	},
}

var updateBoardp2 = function(start, end){
	//Make and save player twos move.
	p2_Position ^= start^end;

	//remove the flag if needed.
	if(evaluation.isHomeQuadEmpty(p2_Position, 2))
		p2_flag = false;

	//reset best first move options.
	AI.bestMovePredicted = AI.nextMoveOption['x' + p2_Position + 'y' + p1_Position] || [];
	AI.nextMoveOption = [];
}

var updateBoardp1 = function(start, end){
	//Make and save player ones move.
	p1_Position ^= start^end;

	//remove the flag if needed.
	if(evaluation.isHomeQuadEmpty(p1_Position, 1))
		p1_flag = false;

	//reset current move options.
	AI.currentMoveOptions = [];
}

var moves = 0;
var totalTime = 0;
var makeMoveAgainstAI = function(start, end, HumanMovesFirst){
	var depth = 7;
	updateBoardp2(start, end); // Human move
	var t0 = Date.now();

	if(!evaluation.Win(p2_Position, 2, p1_flag, p2_flag)){
		AI.maxDepth = depth;

		var t0 = Date.now();
		AI.pvs(-1000, 1000, depth, p1_Position, p2_Position);

		moves++;
		totalTime += (Date.now() -t0);
		console.log("moves: " + moves + " time: " + totalTime);

		var indexOfBestMove;
		var bestScore = -Infinity;
		for (var i = 0; i < AI.currentMoveOptions.length; i++){
			if(AI.currentMoveOptions[i].value > bestScore){
				bestScore = AI.currentMoveOptions[i].value;
				indexOfBestMove = i;
			}
			//else if == then pick random value
		}

		var s = convert.bitToInt(AI.currentMoveOptions[indexOfBestMove].start);
		var e = convert.bitToInt(AI.currentMoveOptions[indexOfBestMove].end);
		updateBoardp1(AI.currentMoveOptions[indexOfBestMove].start, AI.currentMoveOptions[indexOfBestMove].end);
		var w = evaluation.Win(p1_Position, 1, p1_flag, p2_flag);
	}
	return({'from': s, 'to': e, 'AiWin': w});
}

var makeAIMove = function(){
	var depth = 7;
	AI.maxDepth = depth;

	var t0 = Date.now();
	AI.pvs(-1000, 1000, depth, p1_Position, p2_Position);

	moves++;
	totalTime += (Date.now() -t0);
	console.log("moves: " + moves + " time: " + totalTime);

	var indexOfBestMove;
	var bestScore = -Infinity;
	for (var i = 0; i < AI.currentMoveOptions.length; i++){
		if(AI.currentMoveOptions[i].value > bestScore){
			bestScore = AI.currentMoveOptions[i].value;
			indexOfBestMove = i;
		}
		//else if == then pick random value
	}

	var s = convert.bitToInt(AI.currentMoveOptions[indexOfBestMove].start);
	var e = convert.bitToInt(AI.currentMoveOptions[indexOfBestMove].end);
	updateBoardp1(AI.currentMoveOptions[indexOfBestMove].start, AI.currentMoveOptions[indexOfBestMove].end);
	return({'from': s, 'to': e});
}

onmessage = function(e) {
	if(e.data.restart === true){
		console.log("Restarting AI Brain");
		p1_Position = 0b00000000001111100000;
		p2_Position = 0b00000111110000000000; 
		p1_flag = true;
		p2_flag = true;
		AI.currentMoveOptions = [];
		AI.nextMoveOption = [];
		AI.bestMovePredicted = [];
		if(e.data.AIStarts === true){
			var workerResult = makeAIMove();
			postMessage(workerResult);
		}
	} else {
		var workerResult = makeMoveAgainstAI(e.data.from, e.data.to);
		postMessage(workerResult);
	}
}