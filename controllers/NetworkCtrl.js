muonApp.controller('NetworkCtrl', function ($scope, $stateParams) {
	
	cloak.run('http://localhost:8090');

	$scope.hostGame = function(hostname){
		if(hostname != ''){
			console.log(hostname)
		}
	}
});