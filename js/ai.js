var AI = function() {
	var playerTwoPosition = 0b00000111110000000000 //Always the other player
	var playerOnePosition = 0b00000000001111100000 //Always the AI

	var playerOneFlag = true
	var playerTwoFlag = true
	var positionGenes = [10,50,30,50,40] //0,1,2,3,4
	var geneticScalar = 1
	var nodeConnections = [
		[0b00000000000000001110,0b00000000000001010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00000000000111000000,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00000011100000000000,0b00010101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b01110000000000000000,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	];

	//getAvailableMoves() 
		//This returns all the open positions around the piece you are wanting to check
		//The Input should be one bit in a bitBoard given quadrant 0-3 and piece 0-4
		//Example: The top left most corner (1,0) quadrant 1 and peice 0
		//returns: 0b0000000000011100000 that is (1,1) (1,2) and (1,3)
	this.getAvailableMoves = function (quad, node){
		var openPositions = playerTwoPosition^playerOnePosition^0xFFFFF
		return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
	}

	//getAvaiableMovesAI()
		//board = playerTwoPosition^playerOnePosition^1048575
		//This is for temporary recursion positions
	this.getOpenMoveAi = function (quad,node,openPositions){
		return (openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]));
	}

	//this.getQuad()
		//This returns a quadrant 0-3
		//position is a single bitBoard node
		//position = 0b00000001000000000000 returns quadrant 2
	this.getQuad = function (position){
		return position&0x1F?0:(position&0x3E0?1:(position&0x7C00?2:3))
	}

	//this.getNode()
		//returns a node 0-4
		//position is a single bitBoard node
		//position = 0b00000010000000000000 returns node 3
	this.getNode = function (position){
		return position&0x08421?0:(position&0x10842?1:(position&0x21084?2:(position&0x42108?3:4)))
	}

	this.color = function (quad, node){
		if(1<<(quad*5 + node)&playerOnePosition)
			return "W"
		else if(1<<(quad*5 + node)&playerTwoPosition)
			return "B"
		else 
			return "#"
	}

	this.displayBoard = function (){
		if(!this.checkFlag(1,playerOnePosition))
			this.removeFlag(1)
		if(!this.checkFlag(2,playerTwoPosition))
			this.removeFlag(2)
		console.log(playerOneFlag ? "LOCKED":"")
		console.log(""+ this.color(1,0) + "---------"+ this.color(1,1) +"---"+ this.color(0,1) +"---------"+ this.color(0,0) +"");
		console.log("|  \\   /  |   |  \\   /  |");
		console.log("|    "+ this.color(1,2) +"    |   |    "+ this.color(0,2) +"    |");
		console.log("|  /   \\  |   |  /   \\  |");
		console.log(""+ this.color(1,3) +"---------"+ this.color(1,4) +"---"+ this.color(0,4) +"---------"+ this.color(0,3) +"");
		console.log("|         | X |         |");
		console.log(""+ this.color(3,3) + "---------"+ this.color(3,4) +"---"+ this.color(2,4) +"---------"+ this.color(2,3) +"");
		console.log("|  \\   /  |   |  \\   /  |");
		console.log("|    "+ this.color(3,2) +"    |   |    "+ this.color(2,2) +"    |");
		console.log("|  /   \\  |   |  /   \\  |");
		console.log(""+ this.color(3,0) +"---------"+ this.color(3,1) +"---"+ this.color(2,1) +"---------"+ this.color(2,0) +"");
		console.log("                   " + (playerTwoFlag ? "LOCKED":""))
	}

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

	//this.calculateStateValue()
		//player is 1 or 2
		//bitBoard is the bitBoard for playerOne or for playerTwo
	this.calculateStateValue = function (player, bitBoard, endQuad, endNode){
		var peicesInQuad = 0;
		var quad = bitBoard & (0x1F<<(5*endQuad));
		while(quad){
			peicesInQuad += quad&1 ? 1:0;
			quad >>= 1; 
		}

		var qConfig = (bitBoard>>(5*endQuad))&0x1F
		var totalValue = 0;
		var tempBoard = bitBoard;
		var peice = this.getLSB(tempBoard);
		while(tempBoard != 0){
			var inHomeQuad = (this.checkFlag(player,bitBoard) &&  peice&(0b11111 << 5*player))
			if( peicesInQuad == 2 && !inHomeQuad)
				totalValue += 2*positionGenes[this.getNode(peice)]
			else if( peicesInQuad == 1 && !inHomeQuad)
				totalValue += 1.5*positionGenes[this.getNode(peice)]
			else
				totalValue += positionGenes[this.getNode(peice)]
			tempBoard^=peice
			peice = this.getLSB(tempBoard)
		}
		//return parentValue-(totalValue - grandParent)
		return totalValue
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

	//performMoveHvsAI() 
		//This takes the peices starting position and tries to move it to an ending position.
		//
	this.performMoveHvsAI = function (startQuad, startNode, endQuad, endNode){
		var startPosition = (1<<(startQuad*5 + startNode))
		var endPosition = (1<<(endQuad*5 + endNode))

	 	if(startPosition&playerTwoPosition && endPosition&this.getAvailableMoves(startQuad, startNode)){
	 		playerTwoPosition ^= startPosition^endPosition;
	 		this.displayBoard();
	 		var t1 = Date.now();
	 		this.performAiMove(5);
	 		var t2 = Date.now();
	 		console.log((t2-t1)/1000)
	 		this.displayBoard();
	 	}
	 	else
	 		console.log("invalidMove")
	}

	this.Win = function (bitBoard, endQuad, player){
		var quad = bitBoard & (0x1F<<(5*endQuad));
		var inHomeMoveP1 = (this.checkFlag(player,bitBoard) && player == 1 && endQuad == 1);
		var inHomeMoveP2 = (this.checkFlag(player,bitBoard) && player == 2 && endQuad == 2);
		if(!(inHomeMoveP1 || inHomeMoveP2)){
			if(quad == 0b11100 || quad == 0b11010 || quad == 0b11001 || quad == 0b10110 || quad == 0b10011 || quad == 0b01101 || quad == 0b01011 || quad == 0b0011)
				return true;
		}
		return false
	}

	this.performAiMove = function (depth){
		var max = -0xFFFFFFF;
		var tempBoard = playerOnePosition;
		var bestMove;

		//Loop through all the AI's first peices (We want to maximize these)
		var peice = this.getLSB(tempBoard);
		while(tempBoard != 0){
			var openMoves = this.getOpenMoveAi(this.getQuad(peice), this.getNode(peice),playerOnePosition^playerTwoPosition^0xFFFFF);

			//Loop through all the places that peice can move to.
			var nextSpace = this.getLSB(openMoves);
			while( openMoves != 0){
				var bitBoardCopy = playerOnePosition^peice^nextSpace
				var score = this.alphaBeta(2, depth-1, -0xFFFFFFF, 0xFFFFFFF, playerTwoPosition, bitBoardCopy, nextSpace, false)
				if(score > max){
					max = score;
					bestMove = nextSpace^peice;
				}
				openMoves^=nextSpace;
				nextSpace = this.getLSB(openMoves);
			}
			tempBoard^=peice;
			peice = this.getLSB(tempBoard);
		}
		playerOnePosition ^= bestMove;
		if(playerOneFlag && !this.checkFlag(1,playerOnePosition)){
			this.removeFlag(1)
		}
	}

	//this.alphaBeta()
		//this.alphaBeta only returns the value of a move, not the actual move that should be made.
		//player--------can be a 1 or a 2
		//depth---------how far in the tree you would like to go
		//a-------------should start at -infinity
		//b-------------should start at infinity
		//bitBoard------the current players board state
		//bitBoard2-----the other players state
		//move----------the last move that was made (a single binary peice)
		//maximizing----if the player is maximizing then this is TRUE, else FALSE
	this.alphaBeta = function (player, depth, a, b, bitBoard, bitBoard2, space, maximizing){
		if(depth == 0){
			return this.calculateStateValue(player^3, bitBoard2, this.getQuad(space), this.getNode(space));
		}
		var tempBoard = bitBoard;
		for(var peice = this.getLSB(tempBoard); tempBoard; peice = this.getLSB(tempBoard)){
			var openMoves = this.
			getOpenMoveAi(this.getQuad(peice), this.getNode(peice),bitBoard^bitBoard2^0xFFFFF);
			for(var nextSpace = this.getLSB(openMoves); openMoves; nextSpace = this.getLSB(openMoves)){
				var bitBoardCopy = bitBoard^peice^nextSpace
				score = this.Win(bitBoardCopy, this.getQuad(nextSpace), player) ? 0xFFFFFFF : this.alphaBeta(player^3, depth-1, a, b, bitBoard2, bitBoardCopy, nextSpace, !maximizing)
				if(maximizing == true){
					if(score >= b){return b;}
					if(score > a){a = score;}
				} else {
					if(score <= a){return a;}
					if(score < b){b = score;}
				}
				openMoves^=nextSpace;
			}
			tempBoard^=peice
		}
		return maximizing?a:b;
	}
	this.displayBoard()

}