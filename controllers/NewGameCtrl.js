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

	$scope.setSinglePlayer = function(){
		gameCore.pvp = false;
	}

	$scope.setPvp = function(){
		gameCore.pvp = true;
	}

	$scope.toggleswitch = function($event){
		var indicator = document.getElementById('switch_selector');
		
		if($event.target.classList.contains('right')){
			indicator.classList.add('right');
		} else {
			indicator.classList.remove('right');
		}
	}

});