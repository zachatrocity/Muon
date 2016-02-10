muonApp.controller('NetworkCtrl', function ($scope, $stateParams) {
	cloak.run(packjson.serverurl);

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