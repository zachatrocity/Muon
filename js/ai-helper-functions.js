var display = function(){
	//this.checkFlag()
		//return false or 0 if the flag should be removed.
	this.checkFlag = function (player,position){
		if(player == 1){
			return position&0x3E0
		}
		return position&0x7C00
	}

	this.removeFlag = function (player){
		if(player == 1)
			playerOneFlag = false;
		else
			playerTwoFlag = false;
	}

	this.color = function (quad, node, playerOnePosition, playerTwoPosition){
		if(1<<(quad*5 + node)&playerOnePosition)
			return "W"
		else if(1<<(quad*5 + node)&playerTwoPosition)
			return "B"
		else 
			return "#"
	}

	this.displayBoard = function (playerOnePosition, playerTwoPosition){
		if(!this.checkFlag(1,playerOnePosition))
			this.removeFlag(1)
		if(!this.checkFlag(2,playerTwoPosition))
			this.removeFlag(2)
		//console.log(playerOneFlag ? "LOCKED":"")
		console.log(""+ this.color(1,0,playerOnePosition, playerTwoPosition) + "---------"+ this.color(1,1,playerOnePosition, playerTwoPosition) +"---"+ this.color(0,1,playerOnePosition, playerTwoPosition) +"---------"+ this.color(0,0,playerOnePosition, playerTwoPosition) +"");
		console.log("|  \\   /  |   |  \\   /  |");
		console.log("|    "+ this.color(1,2,playerOnePosition, playerTwoPosition) +"    |   |    "+ this.color(0,2,playerOnePosition, playerTwoPosition) +"    |");
		console.log("|  /   \\  |   |  /   \\  |");
		console.log(""+ this.color(1,3,playerOnePosition, playerTwoPosition) +"---------"+ this.color(1,4,playerOnePosition, playerTwoPosition) +"---"+ this.color(0,4,playerOnePosition, playerTwoPosition) +"---------"+ this.color(0,3,playerOnePosition, playerTwoPosition) +"");
		console.log("|         | X |         |");
		console.log(""+ this.color(3,3,playerOnePosition, playerTwoPosition) + "---------"+ this.color(3,4,playerOnePosition, playerTwoPosition) +"---"+ this.color(2,4,playerOnePosition, playerTwoPosition) +"---------"+ this.color(2,3,playerOnePosition, playerTwoPosition) +"");
		console.log("|  \\   /  |   |  \\   /  |");
		console.log("|    "+ this.color(3,2,playerOnePosition, playerTwoPosition) +"    |   |    "+ this.color(2,2,playerOnePosition, playerTwoPosition) +"    |");
		console.log("|  /   \\  |   |  /   \\  |");
		console.log(""+ this.color(3,0,playerOnePosition, playerTwoPosition) +"---------"+ this.color(3,1,playerOnePosition, playerTwoPosition) +"---"+ this.color(2,1,playerOnePosition, playerTwoPosition) +"---------"+ this.color(2,0,playerOnePosition, playerTwoPosition) +"");
		//console.log("                   " + (playerTwoFlag ? "LOCKED":""))
	}


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

var bitManip = function(){
	//BitCount()
		//This function returns the number of 1's in a base 2 number.
		//n is any binary number
	this.BitCount = function(n) { 
	    n = (n & 0x55555555) + ((n >> 1) & 0x55555555) ; 
	    n = (n & 0x33333333) + ((n >> 2) & 0x33333333) ; 
	    n = (n & 0x0f0f0f0f) + ((n >> 4) & 0x0f0f0f0f) ; 
	    n = (n & 0x00ff00ff) + ((n >> 8) & 0x00ff00ff) ; 
	    n = (n & 0x0000ffff) + ((n >> 16)& 0x0000ffff) ; 
	    return n ; 
	}

	//this.getLSB()
		//this takes any binary number and returns the least significant bit
		//example:
		//	this.getLSB(0b11001011000000)
		//	return=0b00000001000000
		//This uses a varient of the HAKMEM algorithm
	this.getLSB = function (binaryNumber){
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