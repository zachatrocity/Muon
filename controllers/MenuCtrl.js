muonApp.controller('MenuCtrl', function ($scope, $stateParams) {
	
	$scope.mouse_over = function() {
		Audio.menuOver.play();
	}
	
	$scope.mouse_click = function() {
		Audio.menuSelect.play();
	}
})
