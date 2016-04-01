muonApp.controller('NewGameCtrl', function ($scope, $stateParams) {
	gameCore.AIGoesFirst = false;
	gameCore.humanteam = 'muon';
	gameCore.AITreeDepth = 5;
	gameCore.pvp = false;

	$scope.setAILevel = function(depth){
		var difset = document.getElementById('diffsettings').children;
		var medium = 5
		if(depth < medium){
			difset[0].classList.remove('gray')
			difset[0].classList.add('green')
			difset[1].classList.add('gray')
			difset[1].classList.remove('blue')
			difset[2].classList.add('gray')
			difset[2].classList.remove('red')
		} else if(depth == medium) {
			difset[0].classList.add('gray')
			difset[0].classList.remove('green')
			difset[1].classList.remove('gray')
			difset[1].classList.add('blue')
			difset[2].classList.add('gray')
			difset[2].classList.remove('red')
		} else {
			difset[0].classList.add('gray')
			difset[0].classList.remove('green')
			difset[1].classList.remove('blue')
			difset[1].classList.add('gray')
			difset[2].classList.remove('gray')
			difset[2].classList.add('red')
		}

		gameCore.AITreeDepth = depth;
	}

	$scope.setPvpGoesFirst = function(choice){
		var pvpmovesettings = document.getElementById('pvpmovesettings').children;
		if(!choice){
			pvpmovesettings[0].classList.remove('gray');
			pvpmovesettings[0].classList.add('green');
			pvpmovesettings[1].classList.remove('blue');
			pvpmovesettings[1].classList.add('gray');
		} else {
			pvpmovesettings[0].classList.remove('green');
			pvpmovesettings[0].classList.add('gray');
			pvpmovesettings[1].classList.remove('gray');
			pvpmovesettings[1].classList.add('blue');
		}
		gameCore.AIGoesFirst = choice;
	}

	$scope.setAIGoesFirst = function(choice){
		
		var movesettings = document.getElementById('movesettings').children;
		if(!choice){
			movesettings[0].classList.remove('gray');
			movesettings[0].classList.add('blue');
			movesettings[1].classList.remove('blue');
			movesettings[1].classList.add('gray');
		} else {
			movesettings[0].classList.remove('blue');
			movesettings[0].classList.add('gray');
			movesettings[1].classList.remove('gray');
			movesettings[1].classList.add('blue');
		}
		gameCore.AIGoesFirst = choice;
	}

	$scope.setTeam = function(team){
		var teamset = document.getElementById('teamsettings').children;
		if(team == 'muon'){
			teamset[0].classList.remove('gray');
			teamset[0].classList.add('green');
			teamset[1].classList.remove('blue');
			teamset[1].classList.add('gray');
		} else {
			teamset[0].classList.add('gray');
			teamset[0].classList.remove('green');
			teamset[1].classList.add('blue');
			teamset[1].classList.remove('gray');
		}
		gameCore.humanteam = team;
	}

	$scope.setPvpTeam = function(team){
		var pvpteamset = document.getElementById('pvpteamset').children;
		if(team == 'muon'){
			pvpteamset[0].classList.remove('gray');
			pvpteamset[0].classList.add('green');
			pvpteamset[1].classList.remove('blue');
			pvpteamset[1].classList.add('gray');
		} else {
			pvpteamset[0].classList.add('gray');
			pvpteamset[0].classList.remove('green');
			pvpteamset[1].classList.add('blue');
			pvpteamset[1].classList.remove('gray');
		}
		gameCore.humanteam = team;
	}

	$scope.setSinglePlayer = function(){
		gameCore.pvp = false;
	}

	$scope.setPvp = function(){
		gameCore.pvp = true;
	}
	
	document.getElementById('one-player').style.display="block";

	$scope.toggleswitch = function($event){
		var indicator = document.getElementById('switch_selector');


		if($event.target.htmlFor == "one-button"){
			document.getElementById('one-player').style.display="block";
			document.getElementById('two-player').style.display="none";
		} else {
			document.getElementById('one-player').style.display="none";
			document.getElementById('two-player').style.display="block";
		}
		
		if($event.target.classList.contains('right')){
			indicator.classList.add('right');
		} else {
			indicator.classList.remove('right');
		}
	}

});