muonApp.controller('NewGameCtrl', function ($scope, $stateParams) {
	gameCore.AIGoesFirst = false;
	gameCore.humanteam = 'muon';

	$scope.setAILevel = function(depth){
		gameCore.AITreeDepth = depth;
	}

	$scope.setAIGoesFirst = function(choice){
		gameCore.AIGoesFirst = choice;
	}

	$scope.setTeam = function(team){
		gameCore.humanteam = team;
	}
});