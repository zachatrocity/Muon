muonApp.controller('BoardCtrl', function ($scope, $stateParams, $state) {

	$scope.startNewGame = function(){
		$scope.showNewGameModal = false;
		gameCore.RestartGame();
	}	                
	
	$scope.quitToMenu = function(){
		$state.go('menu', {});
	}
	
	$scope.sendChat = function(){
		debugger;
		if($scope.chatText != ''){
			if($stateParams.roomid != ''){
				cloak.message('chat', $scope.chatText);
				$scope.chatText = '';
			}
			else {
				//chat against the AI
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