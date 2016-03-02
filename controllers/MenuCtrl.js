muonApp.controller('MenuCtrl', function ($scope, $stateParams, $state) {
	
	var allLinks = document.getElementsByTagName('a');
	
	window.addEventListener('keydown', function(e) {
		//debugger;
		var currentIndex = document.activeElement.tabIndex;
			
		switch (e.keyCode){
			// Down/right key
			case 39: case 40:
				if (currentIndex == 6 || currentIndex == -1)
				{
					currentIndex = 0;
				}
				allLinks[currentIndex].focus();
				break;
			case 37: case 38:
				if (currentIndex == 1 || currentIndex == -1)
				{
					currentIndex = 7;
				}
				allLinks[currentIndex - 2].focus();
				break;
		
		}
	});
	
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
