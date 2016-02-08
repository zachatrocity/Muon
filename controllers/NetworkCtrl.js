muonApp.controller('NetworkCtrl', function ($scope, $stateParams) {

	cloak.run('http://localhost:8090');

	$scope.notInLobby = true;

	$scope.joinLobby = function(username){
		cloak.message('registerUsername', {'username' : username})
		$scope.notInLobby = false;
	}

	$scope.hostGame = function(hostname){
		if(hostname != ''){
			console.log(hostname)
		}
	}
});