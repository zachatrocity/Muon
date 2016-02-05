var GameCore = function() {
	// Draws the board to the screen (console)
	// Open spots are '@', black = 'B', white = 'W'
	this.DisplayBoard = function() {
		console.log("A  " + this.GetColor(0b01001) + "--------" + this.GetColor(0b01010) + "---" + this.GetColor(0b00010) + "-------" + this.GetColor(0b00001));
		console.log("   | \\     /|   |\\     /|");
		console.log("B  " + "|    "+ this.GetColor(0b01011) + "   |   |   " + this.GetColor(0b00011) + "   |");
		console.log("   | /     \\|   |/     \\|");
		console.log("C  " + this.GetColor(0b01100) + "--------" + this.GetColor(0b01101) + "---" + this.GetColor(0b00101) + "-------" + this.GetColor(0b00100));
		console.log("   |		| X |		|");
		console.log("D  " + this.GetColor(0b11100) + "--------" + this.GetColor(0b11101) + "---" + this.GetColor(0b10101) + "-------" + this.GetColor(0b10100));
		console.log("   | \\     /|   |\\     /|");
		console.log("E  " + "|    "+ this.GetColor(0b11011) + "   |   |   " + this.GetColor(0b10011) + "   |");
		console.log("   | /     \\|   |/     \\|");
		console.log("F  " + this.GetColor(0b11001) + "--------" + this.GetColor(0b11010) + "---" + this.GetColor(0b10010) + "-------" + this.GetColor(0b10001));
		console.log("   1    2   3   4   5   6");
	}

	// Returns the color of the piece at the specified location on the board
	this.GetColor = function(position) {
		return this.blackPlayerPositions.indexOf(position) == -1 ? (this.whitePlayerPositions.indexOf(position) == -1 ? "@" : "W") : "B";
	}

	// Moves a piece from one position to another
	// Returns 'true' for successful move, 'false' otherwise
	this.MovePiece = function(from, to) {
		var success = false;
		
		
		
		return success;
	} 

	// Returns 'B' for black won, 'W' for white won, and '@' for no winner
	this.GameWon = function() {
		var winner = '@';

		if (this.CalculateStateValue() == 100) {

		}

		return winner;
	}

	//-----------------------------------------------------------------------------------------------------------------------------------------------

	var playerOnePosition = 0b00010001011000001000
	var playerTwoPosition = 0b00000000000110110010
	var playerOneFlag = true
	var playerTwoFlag = true
	var positionGenes = [2,4,3,4,1]
	var geneticScalar = 1
	// nodeConnections[quad][node]
	var nodeConnections = [
		[0b00000000000000011110,0b00000000000100010101,0b00000000000000011011,0b00000010000000010101,0b10000100001000001110], //quad 0 node 0,1,2,3,4
		[0b00000000001111000000,0b00000000001010100010,0b00000000001101100000,0b01000000001010100000,0b10000100000111010000], //quad 1 node 0,1,2,3,4
		[0b00000111100000000000,0b01000101010000000000,0b00000110110000000000,0b00000101010000001000,0b10000011101000010000], //quad 2 node 0,1,2,3,4
		[0b11110000000000000000,0b10101000100000000000,0b11011000000000000000,0b10101000000100000000,0b01110100001000010000]  //quad 3 node 0,1,2,3,4
	];
	this.GetAvailableMoves = function(player, quad, node) {
		var openPositions = (player == playerTwoPosition) ? playerTwoPosition^playerOnePosition^0b11111111111111111111 : playerOnePosition^playerTwoPosition^0b11111111111111111111;
		return openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]);
	}
	this.PerformHumanMove = function(player, quadFrom, nodeFrom, quadTo, nodeTo) {
		var starting = (1<<(quadFrom*5 + nodeFrom))
		var ending = (1<<(quadTo*5 + nodeTo))
		var playerToMove = player == 1 ? playerOnePosition : playerTwoPosition;
	 	if(starting&playerToMove && ending&getAvailableMoves(quadFrom, nodeFrom)) {
	 		player == 1 ? playerOnePosition ^= starting^ending : playerTwoPosition ^= starting^ending;
	 		console.log("State value: " + this.CalculateStateValue(player, playerToMove, quadTo, nodeTo))
	 	} else {

	 	}
	}
	this.PerformAiMove = function(player, quadFrom, nodeFrom, quadTo, nodeTo) {
		//this.ai.performMoveHvsAI(player, quadFrom, nodeFrom, quadTo, nodeTo);
		
	}
	this.CalculateStateValue = function(player, playerThatMoved, quadTo, nodeTo) {
		var quad = (playerThatMoved>>5*quadTo)&0b11111;
		var value = 0;
		// Check to see if this move was a winning move.
		// these are the cases of when a player is moving in their own quadrant (flag status must be checked)
		if((!(playerOneFlag && player == 1 && quadTo == 2) || (playerTwoFlag && player == 2 && quadTo == 1))
			//If the player wins
			&& (quad^0b11100||quad^0b11010||quad^0b11001||quad^0b10110||quad^0b10011||quad^0b01101||quad^0b01011||quad^0b00111)) {
			return 100;
		} else if ( quad > 0b10001 || quad^0b11111 > 0b10001) {
			value = (geneticScalar + 1)*positionGenes[nodeTo];
		}

		return value;
	}

	var start = new Date().getTime();
	var quadFrom = 2;
	var quadTo = 0;
	var nodeFrom = 3;
	var nodeTo = 3;
	var limit = 600000;
	for (var i = 0; i < limit; i++) {
		this.PerformAiMove(1,quadTo,nodeTo,quadFrom,nodeFrom)
		this.PerformAiMove(1,quadFrom,nodeFrom,quadTo,nodeTo)
	}
	var page_load_time = new Date().getTime() - start;
	//console.log("time for " + (limit*2) + " moves and calculations: " + (page_load_time/1000));
}