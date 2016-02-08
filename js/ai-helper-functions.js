// gameCore.ai.performMoveHvsAI(2,3,0,3)

var display = {
	removeFlag:function(player){
		if(player == 1)
			playerOneFlag = false;
		else
			playerTwoFlag = false;
	},

	color:function(quad, node, p1, p2){
		if(1<<(quad*5 + node)&p1)
			return "W"
		else if(1<<(quad*5 + node)&p2)
			return "B"
		else 
			return "#"
	},

	//If the AI is playing make it p1
	displayBoard:function(p1, p2){
		if(!evaluation.isHomeQuadEmpty(1,p1))
			this.removeFlag(1)
		if(!evaluation.isHomeQuadEmpty(2,p2))
			this.removeFlag(2)
		//console.log(playerOneFlag ? "LOCKED":"")
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
		//console.log("                   " + (playerTwoFlag ? "LOCKED":""))
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
			 if(coordinate == "A1"){return 0b00000000000000100000} 
		else if(coordinate == "A2"){return 0b00000000000001000000}
		else if(coordinate == "A3"){return 0b00000000000010000000}
		else if(coordinate == "A4"){return 0b00000000000100000000}
		else if(coordinate == "A5"){return 0b00000000001000000000}
		else if(coordinate == "B1"){return 0b00000000000000000010}
		else if(coordinate == "B2"){return 0b00000000000000000001}
		else if(coordinate == "B3"){return 0b00000000000000000100}
		else if(coordinate == "B4"){return 0b00000000000000010000}
		else if(coordinate == "B5"){return 0b00000000000000001000}
		else if(coordinate == "C1"){return 0b01000000000000000000}
		else if(coordinate == "C2"){return 0b10000000000000000000}
		else if(coordinate == "C3"){return 0b00100000000000000000}
		else if(coordinate == "C4"){return 0b00001000000000000000}
		else if(coordinate == "C5"){return 0b00010000000000000000}
		else if(coordinate == "D1"){return 0b00000100000000000000}
		else if(coordinate == "D2"){return 0b00000010000000000000}
		else if(coordinate == "D3"){return 0b00000001000000000000}
		else if(coordinate == "D4"){return 0b00000000100000000000}
		else if(coordinate == "D5"){return 0b00000000010000000000}
		else 
			return false
	},

	bitToStandard:function(coordinate){
			 if(coordinate == 0b00000000000000100000){return "A1"} 
		else if(coordinate == 0b00000000000001000000){return "A2"}
		else if(coordinate == 0b00000000000010000000){return "A3"}
		else if(coordinate == 0b00000000000100000000){return "A4"}
		else if(coordinate == 0b00000000001000000000){return "A5"}
		else if(coordinate == 0b00000000000000000010){return "B1"}
		else if(coordinate == 0b00000000000000000001){return "B2"}
		else if(coordinate == 0b00000000000000000100){return "B3"}
		else if(coordinate == 0b00000000000000010000){return "B4"}
		else if(coordinate == 0b00000000000000001000){return "B5"}
		else if(coordinate == 0b01000000000000000000){return "C1"}
		else if(coordinate == 0b10000000000000000000){return "C2"}
		else if(coordinate == 0b00100000000000000000){return "C3"}
		else if(coordinate == 0b00001000000000000000){return "C4"}
		else if(coordinate == 0b00010000000000000000){return "C5"}
		else if(coordinate == 0b00000100000000000000){return "D1"}
		else if(coordinate == 0b00000010000000000000){return "D2"}
		else if(coordinate == 0b00000001000000000000){return "D3"}
		else if(coordinate == 0b00000000100000000000){return "D4"}
		else if(coordinate == 0b00000000010000000000){return "D5"}
		else 
			return false
	},

	//formatQuadAndNodeToBits()
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

	intToBit: function(position) {
		switch (position) {
			case 0:
				return 0b00000000000000100000;
			case 1:
				return 0b00000000000001000000;
			case 2:
				return 0b00000000000010000000;
			case 3:
				return 0b00000000000100000000;
			case 4:
				return 0b00000000001000000000;
			case 5:
				return 0b00000100000000000000;
			case 6:
				return 0b00000010000000000000;
			case 7:
				return 0b00000001000000000000;
			case 8:
				return 0b00000000100000000000;
			case 9:
				return 0b00000000010000000000;
			case 10:
				return 0b00000000000000000010;
			case 11:
				return 0b00000000000000000001;
			case 12:
				return 0b00000000000000000100;
			case 13:
				return 0b00000000000000010000;
			case 14:
				return 0b00000000000000001000;
			case 15:
				return 0b01000000000000000000;
			case 16:
				return 0b10000000000000000000;
			case 17:
				return 0b00100000000000000000;
			case 18:
				return 0b00001000000000000000;
			case 19:
				return 0b00010000000000000000;
			default:
				console.log("Cannot convert from " + position + "to bit");
		}
	}
	// Converts from a bit
	bitToInt: function(position) {
		switch (position) {
			case 0b00000010000000000000:
				return 0;
			case 0b00000010000000000000:
				return 1;
			//...
		}
	}
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
		//return 0 if the players home quadrant is empty.
		//player is a 1 or 2 that represent the player number.
		//position is the current position that needs to be checked.
	isHomeQuadEmpty:function(player, position){
		var quadIsEmpty = false;
		if ( player == 1 && position&0b00000000001111100000 == 0){
			quadIsEmpty = true;
		} 
		else if(player==2&& position&0b00000111110000000000 == 0){
			quadIsEmpty = true;
		}
		return quadIsEmpty;
	},

	stateValue:function(bitBoard, bitBoard2, player){
		var total = 0;
		total += this.stolenRealEstate(bitBoard, bitBoard2);
		total += this.Win(bitBoard, player) ? 1000 : 0;
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
		var winPosition = false;

		var winningPositions = [0b11100, 0b11010, 0b11001, 0b10110, 0b10011, 0b01101, 0b01011, 0b00111]

		for(var i = 0; i < 4; i++){
			var quad = boardAspect.getQuadBits(bitBoard, 0);
			if((!homeFlag || i != player) && winningPositions.indexOf(quad) != -1){
				winPosition = true;
				break;
			}
		}
		return winPosition;
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