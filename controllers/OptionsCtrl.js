muonApp.controller('OptionsCtrl', function ($scope, $stateParams) {
	
	var muteFalseText = 'Mute Sound &nbsp<span class="batch" data-icon="&#xf03b"></span>';
	var muteTrueText = 'Unmute Sound &nbsp<span class="batch" data-icon="&#xf038" style="color: #990000"></span>';
	// Used to maintain the same value when a user leaves the options menu.
	// Uses cookies to store long term.
	var pressCount;
	
	if (getCookieValue("pressCount") == "")
	{
		document.cookie="pressCount=0; expires=0; path=/";
	}
	
	pressCount = getCookieValue("pressCount");
	
	if (pressCount % 2 != 0) 
	{
		document.getElementById("mutebtn").innerHTML = muteTrueText;
	}
	
	$scope.toggleSound = function() {
		pressCount++;
		
		var muteText = document.getElementById("mutebtn").innerHTML;
		
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
		
		document.cookie="pressCount=" + pressCount + "; expires=0; path=/";
	}
	
	function getCookieValue(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) 
		{
			var c = ca[i];
			while (c.charAt(0)==' ') 
			{	
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) 
			{
				var value = ca[i].split('=')[1];
				return value;
			}
		}
		return "";
	}
});


