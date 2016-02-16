muonApp.controller('BoardCtrl', function ($scope, $stateParams, $state) {

	$scope.startNewGame = function(){
		$scope.showNewGameModal = false;
		gameCore.RestartGame();
	}	                
	
	$scope.quitToMenu = function(){
		$state.go('menu', {});
	}
	
	if($stateParams.roomid == ''){
		//local game against AI
	} else {
		if($stateParams.waiting == 1){
		//angular.element(boardHeaderText)[0].innerHTML = "Waiting for opponent";
		document.getElementById('boardHeaderText').innerHTML = "Waiting for opponent";
		} else {
			console.log("attempting to join room");
			cloak.message('joinRoom', $stateParams.roomid);
			document.getElementById('boardHeaderText').innerHTML = "Their turn";
			//no longer waiting, broadcast that player is here
			//start game
		}
	}
	

	gameCore.RestartGame();
	
});