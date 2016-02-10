var gameCore = {
	// The initial position of player 1
	playerOnePosition: 0b00010001011000001000,
	// The initial position of player 2 (the opponent)
	playerTwoPosition: 0b00000000000110110010,
	// The flags for P1 and P2 for if they can can create a triangle in their starting quadrant
	playerOneFlag: true,
	playerTwoFlag: true,

	// The available moves for a position can be found through 'ai.evaluation.nodeConnections'
	ai: AI,

	// Draws the board to the console (solely for debugging purposes)
	// Open spots are '@', black = 'B', white = 'W'
	// Really should change this to be player/P and opponent/O because that's a lot more clear as to who is who
	DrawBoardToConsole: function() {
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
	},

	// Returns the color of the piece at the specified location on the board
	GetColor: function(position) {
		return this.playerOnePosition.indexOf(position) == -1 ? (this.playerTwoPosition.indexOf(position) == -1 ? "@" : "P") : "O";
	},

	// Moves a piece from one position to another
	// Assumes that the move is passed in the form of 0-19
	AttemptMove: function(from, to) {
		var bitFrom = ai.convert(intToBit(from));
		var bitTo = ai.convert(intToBit(to));
		var inputFrom = ai.convert.bitToQuad(bitFrom) + ai.convert.bitToNode(bitFrom);
		var inputEnd = ai.convert.bitToQuad(bitTo) + ai.convert.bitToNode(bitTo);

		// Test to see if move human wants to perform is valid
		if (ValidMove(bitFrom, bitTo)) {
			console.log("Player moved from " + inputFrom + " to " + inputEnd);

			// Perform move that human made
			moveMuonTweenFoci(from, to);

			if (GameWon()) {
				console.log("Player won the game!");
				// Lock the board from further moves somehow
			}
			else {
				// Start a timer so the AI move is not immediate
				var timer = Date.now();
				// Retrieve AI move
				var aiMove = makeMoveAgainstAI();
				timer = Date.now() - timer;
				//moveMuonTweenFoci(aiMove[0], aiMove[1]);
			}
		}
		else {
			console.log("Player attempted a invalid move, from " + inputFrom + " to " + inputEnd);
		}
	},

	// Determines if the move the player wishes to perform is a valid one
	// Assumes that the move is passed in the form of bits
	ValidMove: function(from, to) {
		var temp = ai.evaluation.nodeConnections[ai.convert.bitToQuad(from)][ai.convert.bitToNode(from)];
		var openPositions = ~(playerOnePosition | playerTwoPosition) & temp;

		return openPositions & to > 0;
	},

	// Returns 'P' for player won, 'O' for opponent won, and 'N' for no winner
	GameWon: function() {
		var winner = '@';

		if (this.CalculateStateValue() == 100) {

		}

		return winner;
	},

	//-----------------------------------------------------------------------------------------------------------------------------------------------

	GetAvailableMoves: function(player, quad, node) {
		var openPositions = (player == playerTwoPosition) ? playerTwoPosition^playerOnePosition^0b11111111111111111111 : playerOnePosition^playerTwoPosition^0b11111111111111111111;
		return openPositions&((1<<(quad*5 + node))|nodeConnections[quad][node]);
	},

	PerformHumanMove: function(player, quadFrom, nodeFrom, quadTo, nodeTo) {
		var starting = (1<<(quadFrom*5 + nodeFrom))
		var ending = (1<<(quadTo*5 + nodeTo))
		var playerToMove = player == 1 ? playerOnePosition : playerTwoPosition;
	 	if(starting&playerToMove && ending&getAvailableMoves(quadFrom, nodeFrom)) {
	 		player == 1 ? playerOnePosition ^= starting^ending : playerTwoPosition ^= starting^ending;
	 		console.log("State value: " + this.CalculateStateValue(player, playerToMove, quadTo, nodeTo))
	 	} else {

	 	}
	}
};