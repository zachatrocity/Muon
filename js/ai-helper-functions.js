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
}

var boardAspect = {
	//bitBoard for the player and the quadrant number 0 to 3
	getQuadBits: function(bitBoard, quadrant){
		return bitBoard & (0x1F<<(5*quadrant));
	},

	//getAvaiableMovesAI()
		//board = p2_Position^p1_Position^1048575
		//This is for temporary recursion positions
	getOpenMovesFromTempBoard:function(quad,node,openPositions){
		return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
	},

	//getAvaiableMovesAI()
		//board = p2_Position^p1_Position^1048575
		//This is for temporary recursion positions
	openPositionsAroundPeice:function(quad,node,openPositions){
		var peice = convert.quadNodeToBit(quad,node);
		return ((openPositions&peice)|evaluation.nodeConnections[quad][node]);
	},
}

var convert = {
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
	'nodeConnections':[
		[0b00000000000000001110,0b00000000000001010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00000000000111000000,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00000011100000000000,0b00010101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b01110000000000000000,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	],

	//isHomeQuadEmpty()
		//return 0 if the players home quadrant is empty.
		//player is a 1 or 2 that represent the player number.
		//position is the current position that needs to be checked.
	isHomeQuadEmpty:function(player, position){
		var quadIsEmpty = false;
		if(player == 1 && position&0b00000000001111100000 == 0){
			quadIsEmpty = true;
		} 
		else if(player == 2 && position&0b00000111110000000000){
			quadIsEmpty = true;
		}
		return quadIsEmpty;
	},

	stateValue:function(bitBoard, bitBoard2, player){
		var total = 0;
		total += this.stolenRealEstate(bitBoard, bitBoard2);
		total += this.Win(bitBoard, player);
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

	Win:function(bitBoard, player){
		var homeFlag = this.isHomeQuadEmpty(player,bitBoard);
		var value = 0;
		var i = 1;
		for(var quad = boardAspect.getQuadBits(bitBoard, i); i < 4; i++, quad = boardAspect.getQuadBits(bitBoard, i)){
			if(!(homeFlag || i == player) && (quad == 0b11100 || quad == 0b11010 || quad == 0b11001 || quad == 0b10110 
			|| quad == 0b10011 || quad == 0b01101 || quad == 0b01011 || quad == 0b00111))
				value = 1000;
		}
		return value;
	}
}