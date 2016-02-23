muonApp.controller('NewGameCtrl', function ($scope, $stateParams) {
	gameCore.AIGoesFirst = false;

	$scope.setAILevel = function(depth){
		gameCore.AITreeDepth = depth;
	}

	$scope.setAIGoesFirst = function(choice){
		gameCore.AIGoesFirst = choice;
	}
});