muonApp.controller('MenuCtrl', function ($scope, $stateParams, $state) {
	
	document.getElementById('item1').focus();
	
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

	$scope.mouse_over = function(id) {
		if(Audio.togglesound)
			Audio.menuOver.play();
		
		document.getElementById('item' + id).focus();
		
 	}
	
	$scope.mouse_click = function() {
		// if(Audio.togglesound)
		// 	Audio.menuSelect.play();
	}
})
