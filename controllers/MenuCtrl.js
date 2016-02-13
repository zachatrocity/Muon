muonApp.controller('MenuCtrl', function ($scope, $stateParams, $state) {
	
	$scope.goToNetworkingPage = function(username){
		$scope.showNetworkingModal = false;
		//register username
		$state.go('network', {'username':username});
	}

	$scope.mouse_over = function() {
		Audio.menuOver.play();
	}
	
	$scope.mouse_click = function() {
		//Audio.menuSelect.play();
	}
})
