//Testing

var saveData = {
	'game': [],

	saveMove:function(start, end, player){
		saveData.game[saveData.game.length] = (player == 1 ? "AI: ":"HU: ") + start + " => " + end;
	},
}

var printData = {

	printMoves:function(){
		for (var i = 0; i < saveData.game.length; i++) {
			console.log(saveData.game[i]);
		};
	}
}