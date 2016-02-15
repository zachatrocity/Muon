var p1_Position = 0b00000000001111100000; //Always the AI
var p2_Position = 0b00000111110000000000; //Always the other player

// var p1_Position = 0b01000001001000010000; //Always the AI
// var p2_Position = 0b10000010100010000000; //Always the other player

var p1_flag = true;
var p2_flag = true;
var BITMASK = 0xFFFFF;

var saveData = {
	'game': [],

	saveMove:function(start, end, player){
		saveData.game[saveData.game.length] = saveData.game.length + (player == 1 ? " AI: ":" HU: ") + start + " => " + end;
	},
}

var printData = {

	printMoves:function(){
		for (var i = 0; i < saveData.game.length; i++) {
			console.log(saveData.game[i]);
		};
	},

	showBitBoards:function(bb1, bb2){
    	var ai = (bb1 >>> 0).toString(2);
    	var hu = (bb2 >>> 0).toString(2);

    	while(ai.length < 20){
    		ai = "0" + ai;
    	}
    	while(hu.length < 20){
    		hu = "0" + hu;
    	}

    	console.log("var p1_Position = 0b" + ai);
    	console.log("var p2_Position = 0b" + hu);
	}
}

var display = {
	//The computer is always player1 (p1)
	color:function(quad, node, p1, p2){
		if(1<<(quad*5 + node)&p1)
			return "C"	// for Computer
		else if(1<<(quad*5 + node)&p2)
			return "H"	// for Human
		else 
			return "#"
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

	printGame:function(){
		printData.printMoves();
	},
}

var boardAspect = {
	//bitBoard for the player and the quadrant number 0 to 3
	getQuadBits: function(bitBoard, quadrant){
		return bitBoard & (0x1F<<(5*quadrant));
	},

	//availabeMoves()
		//peice is a bit representation of any peice on the board.
	availabeMoves:function(peice,openPositions){
		var quad = convert.bitToQuad(peice)
		var node = convert.bitToNode(peice)
		return openPositions&evaluation.nodeConnections[quad][node];
	},
}

var convert = {

	//inputToBit()
		//Returns a binary representation of anything in standard from.
		//If the input was not found here the function returns false.
	inputToBit:function(coordinate){
		coordinate = coordinate.toUpperCase();
		switch (coordinate){
			case "A1": return 0b00000000000000100000; 
			case "A2": return 0b00000000000001000000;
			case "A3": return 0b00000000000010000000;
			case "A4": return 0b00000000000100000000;
			case "A5": return 0b00000000001000000000;
			case "B1": return 0b00000000000000000010;
			case "B2": return 0b00000000000000000001;
			case "B3": return 0b00000000000000000100;
			case "B4": return 0b00000000000000010000;
			case "B5": return 0b00000000000000001000;
			case "C1": return 0b01000000000000000000;
			case "C2": return 0b10000000000000000000;
			case "C3": return 0b00100000000000000000;
			case "C4": return 0b00001000000000000000;
			case "C5": return 0b00010000000000000000;
			case "D1": return 0b00000100000000000000;
			case "D2": return 0b00000010000000000000;
			case "D3": return 0b00000001000000000000;
			case "D4": return 0b00000000100000000000;
			case "D5": return 0b00000000010000000000;
			default: return false;
		}
	},

	bitToStandard:function(coordinate){
		switch (coordinate){
			case 0b00000000000000100000: return "A1"; 
			case 0b00000000000001000000: return "A2";
			case 0b00000000000010000000: return "A3";
			case 0b00000000000100000000: return "A4";
			case 0b00000000001000000000: return "A5";
			case 0b00000000000000000010: return "B1";
			case 0b00000000000000000001: return "B2";
			case 0b00000000000000000100: return "B3";
			case 0b00000000000000010000: return "B4";
			case 0b00000000000000001000: return "B5";
			case 0b01000000000000000000: return "C1";
			case 0b10000000000000000000: return "C2";
			case 0b00100000000000000000: return "C3";
			case 0b00001000000000000000: return "C4";
			case 0b00010000000000000000: return "C5";
			case 0b00000100000000000000: return "D1";
			case 0b00000010000000000000: return "D2";
			case 0b00000001000000000000: return "D3";
			case 0b00000000100000000000: return "D4";
			case 0b00000000010000000000: return "D5";
			default: return false;
		}
	},

	// Converts from a 0-19 board configuration to a bit for bitBoard manipulation.
	intToBit: function(position) {
		switch (position) {
			case 0: return 0b00000000000000100000;
			case 1: return 0b00000000000001000000;
			case 2: return 0b00000000000010000000;
			case 3: return 0b00000000000100000000;
			case 4: return 0b00000000001000000000;
			case 5: return 0b00000100000000000000;
			case 6: return 0b00000010000000000000;
			case 7: return 0b00000001000000000000;
			case 8: return 0b00000000100000000000;
			case 9: return 0b00000000010000000000;
			case 10: return 0b00000000000000000010;
			case 11: return 0b00000000000000000001;
			case 12: return 0b00000000000000000100;
			case 13: return 0b00000000000000010000;
			case 14: return 0b00000000000000001000;
			case 15: return 0b01000000000000000000;
			case 16: return 0b10000000000000000000;
			case 17: return 0b00100000000000000000;
			case 18: return 0b00001000000000000000;
			case 19: return 0b00010000000000000000;
			default: console.log("Cannot convert from int " + position + " to bit");
		}
	},

	// Converts from a bit to a 0-19 board configuration for gameCore.
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

	//bitToQuad()
		//This returns a quadrant 0-3
		//position is a single bitBoard node
		//position = 0b00000001000000000000 returns quadrant 2
	bitToQuad: function(position){
		return position&0x1F?0:(position&0x3E0?1:(position&0x7C00?2:3));
	},

	//bitToNode()
		//returns a node 0-4
		//position is a single bitBoard node
		//position = 0b00000010000000000000 returns node 3
	bitToNode: function(position){
		return position&0x08421?0:(position&0x10842?1:(position&0x21084?2:(position&0x42108?3:4)));
	},
}

var bitManip = {
	//BitCount()
		//This function returns the number of 1's in a base 2 number.
		//n is any binary number
	BitCount:function(n) { 
	    n = (n & 0x55555555) + ((n >> 1) & 0x55555555) ; 
	    n = (n & 0x33333333) + ((n >> 2) & 0x33333333) ; 
	    n = (n & 0x0f0f0f0f) + ((n >> 4) & 0x0f0f0f0f) ; 
	    n = (n & 0x00ff00ff) + ((n >> 8) & 0x00ff00ff) ; 
	    n = (n & 0x0000ffff) + ((n >> 16)& 0x0000ffff) ; 
	    return n ; 
	},

	//getLSB()
		//this takes any binary number and returns the least significant bit
		//example:
		//	this.getLSB(0b11001011000000)
		//	return=0b00000001000000
		//This uses a varient of the HAKMEM algorithm
	getLSB: function (binaryNumber){
		if(binaryNumber == 0){
			return 0xFFFFFFF;
		}
		leastSig = 0x80000000;
		if(binaryNumber&0xFFFF){
			leastSig >>>= 16;
			binaryNumber &= 0xFFFF;
		}
		if(binaryNumber&0x00FF00FF){
			leastSig >>>= 8;
			binaryNumber &= 0x00FF00FF
		}
		if(binaryNumber&0x0F0F0F0F){
			leastSig >>>= 4;
			binaryNumber &= 0x0F0F0F0F;
		}
		if(binaryNumber&0x33333333){
			leastSig >>>= 2;
			binaryNumber &= 0x33333333
		}
		if(binaryNumber&0x55555555)
			leastSig >>>= 1;
		return leastSig;
	}
}

var evaluation = {
	//This will be for the spherical game mode.
	'ShpericalNodeConnections':[
		[0b00001000010000101110,0b00000000000001010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00001000010111000001,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00001011100000100001,0b00010101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b01110000010000100001,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	],
	//Normal connections
	'nodeConnections':[
		[0b00000000000000001110,0b00000000000001010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00000000000111000000,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00000011100000000000,0b00010101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b01110000000000000000,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	],

	//validateMove()
		//Input can be in either standard form or bit form
		//open Positions must be the current open positions on the board
	validateMove:function(startPosition, endPosition, openPositions){
		var validation = true;
		if(isNaN(startPosition) || isNaN(endPosition)){
			startPosition = convert.inputToBit(startPosition);
			endPosition = convert.inputToBit(endPosition);
		}
		if(startPosition == false || endPosition == false){
			return false;
		}
		spacesAroundStart = evaluation.nodeConnections[convert.bitToQuad(startPosition)][convert.bitToNode(startPosition)];
		return (openPositions & spacesAroundStart & endPosition) ? true : false;
	},

	//isHomeQuadEmpty()
	//return true if the players home quadrant is empty.
	//player is a 1(AI) or 2(HUMAN) that represent the player number.
	isHomeQuadEmpty:function(bitBoard, player){
		if(player == 2 && (bitBoard&0b111110000000000) == 0){
			return true;
		}
		if(player == 1 && (bitBoard&0b1111100000) == 0){
			return true;
		}
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
		var bits = bitManip.BitCount(quad);
		if(!(quad == 0b01110 || quad == 0b10101) && bits >= 3)
			return true;

		quad = boardAspect.getQuadBits(bitBoard, 1);
		bits = bitManip.BitCount(quad);
		if(!(homeFlag && player == 1) && !(quad == 0b01110 || quad == 0b10101) && bits >= 3)
			return true;

		quad = boardAspect.getQuadBits(bitBoard, 2);
		bits = bitManip.BitCount(quad);
		if(!(homeFlag && player == 2) && !(quad == 0b01110 || quad == 0b10101) && bits >= 3)
			return true;

		quad = boardAspect.getQuadBits(bitBoard, 3);
		bits = bitManip.BitCount(quad);
		if(!(quad == 0b01110 || quad == 0b10101) && bits >= 3)
			return true;

		return false;
	},
}

var timer = {
	't1':0,

	startTimer:function(){
		this.t1 = Date.now();
	},

	changeInTime:function(){
		return Date.now() - this.t1;
	},
}

var AI = {
	'bestScore':-999999,
	'moveList':[],
	'maxDepth':-1,

	pvs:function(alpha, beta, depth, p1_board, p2_board, pNum){
		var p = (pNum == 1 ? p1_board : p2_board);
		if(evaluation.Win(p, pNum, p1_flag, p2_flag)){
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
				if(score >= beta){
					if(pNum == 1 && depth == AI.maxDepth)
						AI.moveList[(AI.moveList).length] = {start: piece, end: nextMove, value:score};
					return beta;
				}
				if(score >= alpha){
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

	if(evaluation.isHomeQuadEmpty(p2_Position, 2)){
		p2_flag = false;
	}

	saveData.saveMove(convert.bitToStandard(start),convert.bitToStandard(end), 2);
}

var updateBoardp1 = function(start, end){
	p1_Position ^= start^end;

	if(evaluation.isHomeQuadEmpty(p1_Position, 1)){
		p1_flag = false;
	}

	saveData.saveMove(convert.bitToStandard(start),convert.bitToStandard(end), 1);
	AI.bestScore = -999999;
	AI.moveList = [];
	display.displayBoard(p1_Position,p2_Position);
	printData.showBitBoards(p1_Position,p2_Position);
}

display.displayBoard(p1_Position,p2_Position);
var makeMoveAgainstAI = function(start, end){
	var moveStart = convert.inputToBit(start);
	var moveEnd = convert.inputToBit(end);
	var depth = 7;

	AI.maxDepth = depth;
	updateBoardp2(moveStart, moveEnd); // Human move
	AI.pvs(-1000, 1000, depth, p1_Position, p2_Position, 2);

	var indexOfBestMove;
	var bestScore = -Infinity;
	for (var i = 0; i < AI.moveList.length; i++) {
		if(AI.moveList[i].value > bestScore){
			bestScore = AI.moveList[i].value;
			indexOfBestMove = i;
		}
	}

	var s = convert.bitToInt(AI.moveList[indexOfBestMove].start)
	var e = convert.bitToInt(AI.moveList[indexOfBestMove].end)
	updateBoardp1(AI.moveList[indexOfBestMove].start, AI.moveList[indexOfBestMove].end);
	return({'from': s, 'to': e});
}

onmessage = function(e) {
	if(e.data.restart === true){
		console.log("Restarting AI Brain");
		p1_Position = 0b00000000001111100000;
		p2_Position = 0b00000111110000000000; 
		display.displayBoard(p1_Position,p2_Position);
	} else {
		console.log('Message received from main script');
		var workerResult = makeMoveAgainstAI(e.data.from, e.data.to);
		console.log('Posting message back to main script');
		postMessage(workerResult);
	}
}