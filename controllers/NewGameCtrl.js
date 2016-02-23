muonApp.controller('NewGameCtrl', function ($scope, $stateParams) {
	$scope.setAILevel = function(depth){
		gameCore.AITreeDepth = depth;
	}
});