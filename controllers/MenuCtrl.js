muonApp.controller('MenuCtrl', function ($scope, $stateParams, $state) {
	
	$scope.goToNetworkingPage = function(username){
		$scope.showNetworkingModal = false;
		//register username
		$state.go('network', {'username':username});
	}

	$scope.showNetworkModal = function(){
		$scope.showNetworkingModal = true;
		setTimeout(function(){
			document.getElementById('usernameInput').focus();
		},1000);
	}

	$scope.mouse_over = function() {
		if(Audio.togglesound)
			Audio.menuOver.play();
 	}
	
	$scope.mouse_click = function() {
		// if(Audio.togglesound)
		// 	Audio.menuSelect.play();
	}
})
