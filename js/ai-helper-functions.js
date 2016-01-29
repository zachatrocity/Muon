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
		if(!evaluation.checkFlag(1,p1))
			this.removeFlag(1)
		if(!evaluation.checkFlag(2,p2))
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


	//this.calculateStateValue()
		//player is 1 or 2
		//bitBoard is the bitBoard for playerOne or for playerTwo
		// this.calculateStateValue = function (player, bitBoard, endQuad, endNode){
		// 	var peicesInQuad = 0;
		// 	var quad = bitBoard & (0x1F<<(5*endQuad));
		// 	while(quad){
		// 		peicesInQuad += quad&1 ? 1:0;
		// 		quad >>= 1; 
		// 	}

		// 	var qConfig = (bitBoard>>(5*endQuad))&0x1F
		// 	var totalValue = 0;
		// 	var tempBoard = bitBoard;
		// 	var peice = this.getLSB(tempBoard);
		// 	while(tempBoard != 0){
		// 		var inHomeQuad = (this.checkFlag(player,bitBoard) &&  peice&(0b11111 << 5*player))
		// 		if( peicesInQuad == 2 && !inHomeQuad)
		// 			totalValue += 2*positionGenes[this.getNode(peice)]
		// 		else if( peicesInQuad == 1 && !inHomeQuad)
		// 			totalValue += 1.5*positionGenes[this.getNode(peice)]
		// 		else
		// 			totalValue += positionGenes[this.getNode(peice)]
		// 		tempBoard^=peice
		// 		peice = this.getLSB(tempBoard)
		// 	}
		// 	//return parentValue-(totalValue - grandParent)
		// 	return totalValue
		// }
}

var boardAspect = {
	//this.getQuad()
		//This returns a quadrant 0-3
		//position is a single bitBoard node
		//position = 0b00000001000000000000 returns quadrant 2
	getQuad: function(position){
		return position&0x1F?0:(position&0x3E0?1:(position&0x7C00?2:3));
	},

	//this.getNode()
		//returns a node 0-4
		//position is a single bitBoard node
		//position = 0b00000010000000000000 returns node 3
	getNode: function(position){
		return position&0x08421?0:(position&0x10842?1:(position&0x21084?2:(position&0x42108?3:4)));
	},

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

	//this.getLSB()
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

	//checkFlag()
		//return false or 0 if the flag should be removed.
	checkFlag:function(player,position){
		if(player == 1){
			return position&0x3E0
		}
		return position&0x7C00
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
			var connections = this.nodeConnections[boardAspect.getQuad(peice)][boardAspect.getNode(peice)];
			var adjacentOpponentPeices = connections&bitBoard2;
			stolenSpace += bitManip.BitCount(adjacentOpponentPeices);
			bitBoard ^= peice;
		}
		return stolenSpace;
	},

	Win:function(bitBoard, player){
		var homeFlag = this.checkFlag(player,bitBoard);
		var i = 1;
		for(var quad = boardAspect.getQuadBits(bitBoard, i); i < 4; i++, quad = boardAspect.getQuadBits(bitBoard, i)){
			if(!(homeFlag || i == player) && (quad == 0b11100 || quad == 0b11010 || quad == 0b11001 || quad == 0b10110 
			|| quad == 0b10011 || quad == 0b01101 || quad == 0b01011 || quad == 0b00111))
				return 1000;
		}
		return 0;
	}
}