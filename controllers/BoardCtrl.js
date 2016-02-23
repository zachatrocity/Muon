muonApp.controller('BoardCtrl', function ($scope, $stateParams, $state) {

	$scope.startNewGame = function(){
		BoardGUI.hideLoseModal();
		BoardGUI.hideWinModal();
		gameCore.RestartGame();
	}	                
	
	$scope.quitToMenu = function(){
		$state.go('menu', {});
		console.log('leaving room');
		if (Network.isConnected){
			cloak.message('leaveRoom');
			Network.isConnected = false;
			cloak.end();
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

	if($stateParams.roomid == ''){
		//local game against AI
		gameCore.RestartGame(false);
	} else {
		if($stateParams.waiting == '1'){
		//angular.element(boardHeaderText)[0].innerHTML = "Waiting for opponent";
		document.getElementById('boardHeaderText').innerHTML = "Waiting for opponent";
		BoardGUI.showWaitingModal();
		gameCore.RestartGame(true);

		} else {
			console.log("attempting to join room");
			cloak.message('joinRoom', $stateParams.roomid);
			document.getElementById('boardHeaderText').innerHTML = "Their turn";
			gameCore.RestartGame(true);
			//no longer waiting, broadcast that player is here
			//start game
		}
	}
	
});