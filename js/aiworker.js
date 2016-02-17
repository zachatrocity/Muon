var p1_Position = 0b00000000001111100000; //Always the AI
var p2_Position = 0b00000111110000000000; //Always the other player
var p1_flag = true;
var p2_flag = true;
var BITMASK = 0xFFFFF;

var display = {
	color:function(quad, node, p1, p2){
		if(1<<(quad*5 + node)&p1) return "C";
		else if(1<<(quad*5 + node)&p2) return "H";
		else return "#";
	},
	displayBoard:function(p1, p2){
		console.log(p1_flag ? "LOCKED":"")
		console.log(""+ this.color(1,0,p1, p2) + "---------"+ this.color(1,1,p1, p2) +"---"+ this.color(0,1,p1, p2) +"---------"+ this.color(0,0,p1, p2) +"");
		console.log("|  \\   /  |   |  \\   /  |");
		console.log("|    "+ this.color(1,2,p1, p2) +"    |   |    "+ this.color(0,2,p1, p2) +"    |");
		console.log("|  /   \\  |   |  /   \\  |");
		console.log(""+ this.color(1,3,p1, p2) +"---------"+ this.color(1,4,p1, p2) +"---"+ this.color(0,4,p1, p2) +"---------"+ this.color(0,3,p1, p2) +"");
		console.log("|         | X |         |");
		console.log(""+ this.color(3,3,p1, p2) + "---------"+ this.color(3,4,p1, p2) +"---"+ this.color(2,4,p1, p2) +"---------"+ this.color(2,3,p1, p2) +"");
		console.log("|  \\   /  |   |  \\   /  |");
		console.log("|    "+ this.color(3,2,p1, p2) +"    |   |    "+ this.color(2,2,p1, p2) +"    |");
		console.log("|  /   \\  |   |  /   \\  |");
		console.log(""+ this.color(3,0,p1, p2) +"---------"+ this.color(3,1,p1, p2) +"---"+ this.color(2,1,p1, p2) +"---------"+ this.color(2,0,p1, p2) +"");
		console.log("                   " + (p2_flag ? "LOCKED":""))
	},
}

var boardAspect = {
	//bitBoard for the player and the quadrant number 0 to 3
	getQuadBits: function(bitBoard, quadrant){
		return bitBoard & (0x1F<<(5*quadrant));
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

	stateValue:function(bitBoard, bitBoard2, player){
		var total = 0;
		var currentBitBoard = (player == 1 ? bitBoard : bitBoard2);
		total += this.stolenRealEstate(bitBoard, bitBoard2);
		total += this.clearingFlag(currentBitBoard, player);
		return total;
	},

	clearingFlag:function(bitBoard, player){
		return ( this.isHomeQuadEmpty(bitBoard, player) ? 50 : 0);
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
	'nextMoveOptions':[],
	'bestMoveOptions':[],
	'maxDepth':-1,
	'bSearchPv':true,

	pvs:function(alpha, beta, depth, p1_board, p2_board, pNum){
		var p = (pNum == 1 ? p1_board : p2_board);

		//Check for a win condition. If the win is close to the top of the tree it's worth more.
		if(evaluation.Win(p, pNum, p1_flag, p2_flag))
			return ~(100 * (depth + 1))+1; // because of negation the caller gets back 1000
		if(depth == 0)
			return ~evaluation.stateValue(p1_board, p2_board, pNum) + 1;

		pNum ^= 3; // Change the player number

		//Get and loop through all the players pieces.
		var allPieces = pNum == 1 ? p1_board : p2_board;
		var piece, allSpaces, moves, nextMove, b1, b2, score;
		for(piece = bitManip.getLSB(allPieces); allPieces; piece = bitManip.getLSB(allPieces)){
			allSpaces = p1_board^p2_board^BITMASK;
			moves = boardAspect.availabeMoves(piece, allSpaces);

			//Get and loop through all the moves a piece can make.
			for(nextMove = bitManip.getLSB(moves); moves; nextMove = bitManip.getLSB(moves)){

				//b1 and b2 are the temp values for each move made on a board(b)
				b1 = (pNum == 1 ? p1_board^piece^nextMove : p1_board);
				b2 = (pNum == 2 ? p2_board^piece^nextMove : p2_board);
				if(AI.bSearchPv)
					score = -AI.pvs(~beta+1, ~alpha+1, depth-1, b1, b2, pNum);
				else{
					score = -AI.pvs(~alpha, ~alpha+1, depth-1, b1, b2, pNum);
					if(score > alpha)
						score = -AI.pvs(~beta+1, ~alpha+1, depth-1, b1, b2, pNum);
				}

				if(depth == AI.maxDepth)
					AI.currentMoveOptions[(AI.currentMoveOptions).length] = {start: piece, end: nextMove, value:score};
				else if(depth == AI.maxDepth - 2) // Setup bestfirst search move options.
					AI.nextMoveOptions[p2_board^p1_board] = AI.insertMove({'start': piece, 'end': nextMove, 'score': score}, p2_board^p1_board);
				if(score >= beta)
					return beta;
				if(score >= alpha){
					alpha = score;
					AI.bSearchPv = false;
				}
				

				moves ^= nextMove; //nextMove has been checked, remove it from moves
			}
			allPieces ^= piece; //piece has been checked, remove it from allPieces
		}
		return alpha;
	},

	insertMove:function(element, p2_board) {
		var array = AI.nextMoveOptions[p2_board] || [];
		array.splice(AI.locationOf(element, array) + 1, 0, element);
		return array;
	},

	locationOf:function(element, array, start, end) {
		start = start || 0;
		end = end || array.length;

		var pivot = parseInt(start + (end - start) / 2, 10);

		if (end-start <= 1 || array[pivot].score === element.score) 
			return pivot;
		if (array[pivot].score < element.score) 
			return AI.locationOf(element, array, pivot, end);
		return AI.locationOf(element, array, start, pivot);
	},
}

var updateBoardp2 = function(start, end){
	//Make and save player twos move.
	p2_Position ^= start^end;

	//remove the flag if needed.
	if(evaluation.isHomeQuadEmpty(p2_Position, 2))
		p2_flag = false;

	//reset best first move options.
	AI.bestMoveOptions = AI.nextMoveOptions[p2_Position^p1_Position] || [];
	AI.nextMoveOptions = [];
}

var updateBoardp1 = function(start, end){
	//Make and save player ones move.
	p1_Position ^= start^end;

	//remove the flag if needed.
	if(evaluation.isHomeQuadEmpty(p1_Position, 1))
		p1_flag = false;

	//reset current move options.
	AI.currentMoveOptions = [];
	display.displayBoard(p1_Position,p2_Position);
}

var makeMoveAgainstAI = function(start, end){
	var depth = 7;

	AI.maxDepth = depth;
	updateBoardp2(start, end); // Human move
	AI.pvs(-1000, 1000, depth, p1_Position, p2_Position, 2);

	//Find the best move to be made.
	var indexOfBestMove;
	var bestScore = -Infinity;
	for (var i = 0; i < AI.currentMoveOptions.length; i++) {
		if(AI.currentMoveOptions[i].value > bestScore){
			bestScore = AI.currentMoveOptions[i].value;
			indexOfBestMove = i;
		}
	}

	var s = convert.bitToInt(AI.currentMoveOptions[indexOfBestMove].start)
	var e = convert.bitToInt(AI.currentMoveOptions[indexOfBestMove].end)
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
		AI.nextMoveOptions = [];
		AI.bestMoveOptions = [];

		display.displayBoard(p1_Position,p2_Position);
	} else {
		console.log('Message received from main script');
		var workerResult = makeMoveAgainstAI(e.data.from, e.data.to);
		console.log('Posting message back to main script');
		postMessage(workerResult);
	}
}