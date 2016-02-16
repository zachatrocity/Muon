muonApp.controller('NetworkCtrl', function ($scope, $stateParams) {

	cloak.run(packjson.serverurl);

	$scope.$on('$viewContentLoaded', function(){
		setTimeout(function(){ 
			cloak.message('registerUsername', {'username' : $stateParams.username})
			cloak.message('listRooms');
		}, 1000);
	});
	
	$scope.refresh = function(){
		cloak.message('listUsers');
		cloak.message('listRooms');
	}

	$scope.createRoom = function(){
		cloak.message('createRoom', {
	      name: escape($stateParams.username + "'s Game")
	    });
	}

	$scope.joinRoom = function(id){
		console.log("attempting to join room");
		cloak.message('joinRoom', id);
	}
});