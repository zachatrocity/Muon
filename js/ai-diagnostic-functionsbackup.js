//Testing

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