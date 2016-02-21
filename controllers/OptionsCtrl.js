muonApp.controller('OptionsCtrl', function ($scope, $stateParams) {
	
	$scope.toggleSound = function() {
		var muteText = document.getElementById("mutebtn").innerHTML;
		var muteFalseText = 'Mute Sound &nbsp<span class="batch" data-icon="&#xf03b"></span>';
		var muteTrueText = 'Unmute Sound &nbsp<span class="batch" data-icon="&#xf038"></span>';
		
		if (muteText.indexOf("Unmute") == -1)
		{
			Audio.background.mute();
			document.getElementById("mutebtn").innerHTML = muteTrueText;
		}
		else
		{
			Audio.background.unmute();
			document.getElementById("mutebtn").innerHTML = muteFalseText;
		}
	}
});