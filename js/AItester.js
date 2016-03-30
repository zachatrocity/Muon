var AITester = {
	AIOne: new Worker('./js/aiworker.js'),
	AITwo: new Worker('./js/aiworker.js'),
	AIOneFirst: true,
	AIDepth: 7,
	init: function(){
		AITester.AIOne.onmessage = AITester.AIOneOnMessage;
		AITester.AITwo.onmessage = AITester.AITwoOnMessage;
	},
	AIOneOnMessage: function(e){
		console.log('AIone MOVE:', e.data);
		if(!e.data.AiWin)
			AITester.AITwo.postMessage({ 'from': e.data.from, 'to': e.data.to });
	},
	AITwoOnMessage: function(a){
		console.log('AItwo MOVE:', a.data);
		if(!a.data.AiWin)
			AITester.AIOne.postMessage({ 'from': a.data.from, 'to': a.data.to });
	},
	start: function(){
		if(AITester.AIOneFirst){
			AITester.AIOne.postMessage({ 
				'restart': true,
				'AIStarts': true,
				'depth': AITester.AIDepth,
				'AiStartingPosition': 'top'
			});
			AITester.AITwo.postMessage({ 
				'restart': true,
				'AIStarts': false,
				'depth': AITester.AIDepth,
				'AiStartingPosition': 'bottom'
			});
		}
	},
	end: function(){

	}
}