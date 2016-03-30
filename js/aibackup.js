var AI_position = 0b00000000001111100000; //Always the AI
var HU_position = 0b00000111110000000000; //Always the other player
var AI_flag = true;
var HU_flag = true;
var BITMASK = 0xFFFFF;

//For now this only stores losses
var transposition = {
	'table':[],
	add:function(b1,b2,AI_tempFlag,HU_tempFlag,score){
		var state = b1.toString(2) + b2.toString(2) + (AI_tempFlag?1:0) + (HU_tempFlag?1:0);
		transposition.table[state] = score;
	},
	get:function(b1,b2,AI_tempFlag,HU_tempFlag){
		var state = b1.toString(2) + b2.toString(2) + (AI_tempFlag ? 1:0) + (HU_tempFlag ? 1:0);
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

	//piece is a bit representation of any piece on the board.
	availabeMoves:function(piece,openPositions){
		var quad = convert.bitToQuad(piece)
		var node = convert.bitToNode(piece)

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

	stateValue:function(bitBoard, bitBoard2, AI_tempFlag, HU_tempFlag, player){
		var total = 0;
		var currentBitBoard = (player == 1 ? bitBoard : bitBoard2);
		total += this.stolenRealEstate(bitBoard, bitBoard2);
		total += this.isHomeQuadEmpty(bitBoard, AI.AIPlayerNumber) ? 5 : -1;
		total += this.isHomeQuadEmpty(bitBoard2, AI.HUPlayerNumber) ? -5 : 1;
		return total;
	},

	stolenRealEstate:function(bitBoard, bitBoard2){
		var stolenSpace = 0
		for(var piece = bitManip.getLSB(bitBoard); bitBoard!=0; piece = bitManip.getLSB(bitBoard)){
			var connections = this.nodeConnections[convert.bitToQuad(piece)][convert.bitToNode(piece)];
			var adjacentOpponentpieces = connections&bitBoard2;
			stolenSpace += bitManip.BitCount(adjacentOpponentpieces);
			bitBoard ^= piece;
		}
		return stolenSpace;
	},

	positioning:function(bitBoard, bitBoard2){
		for(var i = 0; i < 4; i++){
			quadValueBitBoard = boardAspect.getQuadBits(bitBoard, quadrant);
			quadValueBitBoard2 = boardAspect.getQuadBits(bitBoard2, quadrant);
			
		}
	},

	Win:function(bitBoard, player, AI_tempFlag, HU_tempFlag){
		var homeFlag = player == 1  ? AI_tempFlag : HU_tempFlag;
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
	'AIPlayerNumber': 0,
	'HUPlayerNumber': 0,

	DeepPVSAI:function(alpha, beta, depth, AI_position, HU_position, AI_tempFlag, HU_tempFlag){
		//Check for a win condition. If the win is close to the top of the tree it's worth more.
		if(evaluation.Win(HU_position, AI.HUPlayerNumber, AI_tempFlag, HU_tempFlag))
			return ~(100 * (depth + 1)) + 1;
		if(depth == 0)
			return ~(evaluation.stateValue(AI_position, HU_position, AI_tempFlag, HU_tempFlag, AI.HUPlayerNumber)) + 1

		//Get and loop through all the players pieces.
		var allPieces = AI_position;
		var allSpaces, moves, b1, score, piece, nextMove;

		for(piece = bitManip.getLSB(allPieces); allPieces != 0; piece = bitManip.getLSB(allPieces)){
			allSpaces = AI_position^HU_position^BITMASK;
			moves = boardAspect.availabeMoves(piece, allSpaces);

			//Get and loop through all the moves a piece can make.
			for(nextMove = bitManip.getLSB(moves); moves != 0; nextMove = bitManip.getLSB(moves)){
				b1 = AI_position^piece^nextMove;
				AI_tempFlag = AI_tempFlag ? !evaluation.isHomeQuadEmpty(b1,AI.AIPlayerNumber) : AI_tempFlag

				if(AI.bSearchPv)
					score = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, HU_position, AI_tempFlag, HU_tempFlag);
				else{
					score = -AI.DeepPVSHU(~alpha, ~alpha+1, depth-1, b1, HU_position, AI_tempFlag, HU_tempFlag);
					if(score > alpha)
						score = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, HU_position, AI_tempFlag, HU_tempFlag);
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
		return alpha;
	},

	DeepPVSHU:function(alpha, beta, depth, AI_position, HU_position, AI_tempFlag, HU_tempFlag){
		//Check for a win condition. If the win is close to the top of the tree it's worth more.
		if(evaluation.Win(AI_position, AI.AIPlayerNumber, AI_tempFlag, HU_tempFlag))
			return ~(100 * (depth + 1)) + 1;
		if(depth == 0)
			return ~(evaluation.stateValue(AI_position, HU_position, AI_tempFlag, HU_tempFlag, AI.AIPlayerNumber)) + 1

		//Get and loop through all the players pieces.
		var allPieces = HU_position;
		var piece, allSpaces, moves, nextMove, b2, score;
		for(piece = bitManip.getLSB(allPieces); allPieces != 0; piece = bitManip.getLSB(allPieces)){
			allSpaces = AI_position^HU_position^BITMASK;
			moves = boardAspect.availabeMoves(piece, allSpaces);

			//Get and loop through all the moves the piece can make.
			for(nextMove = bitManip.getLSB(moves); moves != 0; nextMove = bitManip.getLSB(moves)){
				b2 = HU_position^piece^nextMove;
				HU_tempFlag = HU_tempFlag ? !evaluation.isHomeQuadEmpty(b2, AI.HUPlayerNumber) : HU_tempFlag
				if(AI.bSearchPv)
					score = -AI.DeepPVSAI(~beta+1, ~alpha+1, depth-1, AI_position, b2, AI_tempFlag, HU_tempFlag);
				else{
					score = -AI.DeepPVSAI(~alpha, ~alpha+1, depth-1, AI_position, b2, AI_tempFlag, HU_tempFlag);
					if(score > alpha)
						score = -AI.DeepPVSAI(~beta+1, ~alpha+1, depth-1, AI_position, b2, AI_tempFlag, HU_tempFlag);
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

	pvs:function(alpha, beta, depth, AI_position, HU_position){
		var allPieces = AI_position;
		var piece, moves, nextMove, b1,AI_tempFlag,score;

		//loop through all the AIs pieces
		for(piece = bitManip.getLSB(allPieces); allPieces != 0; piece = bitManip.getLSB(allPieces)){
			moves = boardAspect.availabeMoves(piece, (AI_position^HU_position^BITMASK));

			//loop through all the moves that piece can make.
			for(nextMove = bitManip.getLSB(moves); moves != 0; nextMove = bitManip.getLSB(moves)){

				b1 = AI_position^piece^nextMove;
				AI_tempFlag = AI_flag ? !evaluation.isHomeQuadEmpty(b1, AI.AIPlayerNumber) : AI_flag;
				
				score = -AI.DeepPVSHU(~beta+1, ~alpha+1, depth-1, b1, HU_position, AI_tempFlag, HU_flag);

				AI.currentMoveOptions[(AI.currentMoveOptions).length] = {start: piece, end: nextMove, value:score};
				moves ^= nextMove
			}
			allPieces ^= piece
		}
	},
}

var updateHumanBoard = function(start, end){
	//Make and save player twos move.
	HU_position ^= start^end;

	//remove the flag if needed.
	if(evaluation.isHomeQuadEmpty(HU_position, AI.HUPlayerNumber))
		HU_flag = false;

	//reset best first move options.
	AI.bestMovePredicted = AI.nextMoveOption['x' + HU_position + 'y' + AI_position] || [];
	AI.nextMoveOption = [];
}

var updateAIBoard = function(start, end){
	//Make and save player ones move.
	AI_position ^= start^end;

	//remove the flag if needed.
	if(evaluation.isHomeQuadEmpty(AI_position, AI.AIPlayerNumber))
		AI_flag = false;

	//reset current move options.
	AI.currentMoveOptions = [];
}

var moves = 0;
var totalTime = 0;
var makeMoveAgainstAI = function(start, end, HumanMovesFirst){
	updateHumanBoard(start, end); // Human move
	if(!evaluation.Win(HU_position, AI.HUPlayerNumber, AI_flag, HU_flag)){
		AI.pvs(-1000, 1000, AI.maxDepth, AI_position, HU_position);
		moves++;

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
		updateAIBoard(AI.currentMoveOptions[indexOfBestMove].start, AI.currentMoveOptions[indexOfBestMove].end);
		var w = evaluation.Win(AI_position, AI.AIPlayerNumber, AI_flag, HU_flag);
	}

	return({'from': s, 'to': e, 'AiWin': w});
}

var makeAIMove = function(){
	AI.pvs(-1000, 1000, AI.maxDepth, AI_position, HU_position);
	moves++;

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
	updateAIBoard(AI.currentMoveOptions[indexOfBestMove].start, AI.currentMoveOptions[indexOfBestMove].end);
	return({'from': s, 'to': e});
}

onmessage = function(e) {
	if(e.data.restart === true){
		console.log("Restarting AI Brain");
		if(e.data.AiStartingPosition == "bottom"){
			AI_position = 0b00000111110000000000;
			HU_position = 0b00000000001111100000;
			AI.AIPlayerNumber = 2;
			AI.HUPlayerNumber = 1;
		} else {
			AI_position = 0b00000000001111100000;
			HU_position = 0b00000111110000000000;
			AI.AIPlayerNumber = 1;
			AI.HUPlayerNumber = 2;
		}
		AI_flag = true;
		HU_flag = true;
		AI.currentMoveOptions = [];
		AI.nextMoveOption = [];
		AI.bestMovePredicted = [];
		AI.maxDepth = e.data.depth;
		if(e.data.AIStarts === true){
			var workerResult = makeAIMove();
			postMessage(workerResult);
		}
	} else {
		var workerResult = makeMoveAgainstAI(e.data.from, e.data.to);
		postMessage(workerResult);
	}
}