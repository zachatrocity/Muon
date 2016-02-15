muonApp.controller('BoardCtrl', function ($scope, $stateParams, $state) {

	$scope.startNewGame = function(){
		$scope.showNewGameModal = false;
		gameCore.RestartGame();
	}	                
	
	$scope.quitToMenu = function(){
		$state.go('menu', {});
	}

	// if(gameCore.board.d3force != null){
	// 	gameCore.board.clearBoard();
	// 	gameCore.RestartGame();
	// 	gameCore.board.createBoard();		
	// } else {
	// 	gameCore.board.createBoard();
	// }

	gameCore.RestartGame();
	
});