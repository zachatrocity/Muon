muonApp.controller('BoardCtrl', function ($scope, $stateParams) {

	$scope.startNewGame = function(){
		$scope.showNewGameModal = false;
		gameCore.board.restartBoard();
		gameCore.RestartGame();
	}	                
	
	$scope.remove_board = function(){
		gameCore.board.d3force.stop();
		d3.select(".d3gamepeices").remove();
	}

	gameCore.board.createBoard();
});