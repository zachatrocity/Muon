muonApp.controller('BoardCtrl', function ($scope, $stateParams, $state) {

	var timer = 0, seconds = 0, minutes = 0, hours = 0;

	setInterval(function(){

		seconds++;
	    if (seconds >= 60) {
	        seconds = 0;
	        minutes++;
	        if (minutes >= 60) {
	            minutes = 0;
	            hours++;
	        }
	    }

		document.getElementById("timer").textContent = (minutes > 0) ? minutes + ":" + seconds : seconds;
	}, 1000);

	$scope.startNewGame = function(){
		BoardGUI.hideLoseModal();
		BoardGUI.hideWinModal();
		BoardGUI.hideDrawModal();
		gameCore.RestartGame();
	}	          

	$scope.proposeDraw = function(){
		if(gameCore.ProposeDrawToAI()){
			gameCore.EndGame();
		} else {
			console.log('cannot draw at this time');
		}
	}      
	
	$scope.quitToMenu = function(){
		$state.go('menu', {});
		console.log('leaving room');
		if (Network.isConnected){
			cloak.message('leaveRoom'); 
		}
	}
	
	$scope.sendChat = function(){
		if($scope.chatText != ''){
			if($stateParams.roomid != ''){
				cloak.message('chat', $scope.chatText);
				$scope.chatText = '';
			}
			else {
				//chat against the AI
				BoardGUI.appendChatMessage($scope.chatText, true);
				$scope.chatText = '';
				var category = aichat[_.shuffle(_.keys(aichat))[0]];
				var randex = Math.floor(Math.random() * category.length) + 0;
				BoardGUI.appendChatMessage(category[randex], false);
			}
		}
	}

	$scope.gameboardLoaded = function(e){
		if($stateParams.roomid == ''){
			//local game against AI
			gameCore.RestartGame(false);
		} else {
			if($stateParams.waiting == '1'){
			//angular.element(boardHeaderText)[0].innerHTML = "Waiting for opponent";
			document.getElementById('boardHeaderText').innerHTML = "Waiting for opponent";
			BoardGUI.showWaitingModal();
			gameCore.network.role = 'host';
			gameCore.RestartGame(true);

			} else {
				console.log("attempting to join room");
				cloak.message('joinRoom', $stateParams.roomid);
				document.getElementById('boardHeaderText').innerHTML = "Their turn";
				gameCore.network.role = 'client';
				gameCore.RestartGame(true);
				//client is here
				//start game
			}
		}
	}
	
});