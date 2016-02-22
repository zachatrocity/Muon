muonApp.controller('OptionsCtrl', function ($scope, $stateParams) {
	
	var muteFalseText = 'Mute Sound &nbsp<span class="batch" data-icon="&#xf03b"></span>';
	var muteTrueText = 'Unmute Sound &nbsp<span class="batch" data-icon="&#xf038" style="color: #990000"></span>';

	db.get('music_enabled').then(function(doc) {
		if(doc.title){
			document.getElementById("mutebtn").innerHTML = muteFalseText;
		} else {
			document.getElementById("mutebtn").innerHTML = muteTrueText;
		}
	})

	$scope.toggleSound = function() {
		
		var muteText = document.getElementById("mutebtn").innerHTML;
		
		if (muteText.indexOf("Unmute") == -1)
		{			
			db.get('music_enabled').then(function(doc) {
				return db.put({
					_id: 'music_enabled',
					_rev: doc._rev,
					title: false
				});
			}).then(function(response) {
			  // handle response
			  Audio.background.stop()
			}).catch(function (err) {
			  console.log(err);
			});
			document.getElementById("mutebtn").innerHTML = muteTrueText;
		}
		else
		{
			db.get('music_enabled').then(function(doc) {
				return db.put({
					_id: 'music_enabled',
					_rev: doc._rev,
					title: true
				});
			}).then(function(response) {
			  // handle response
			  Audio.background.play()
			}).catch(function (err) {
			  console.log(err);
			});
			document.getElementById("mutebtn").innerHTML = muteFalseText;
		}
	}
	
});


