muonApp.controller('OptionsCtrl', function ($scope, $stateParams) {
	
	var muteMusicFalseText = 'Mute Music';
	var muteMusicTrueText = 'Unmute Music';

	var muteSoundFXFalseText = 'Mute Sound FX';
	var muteSoundFXTrueText = 'Unmute Sound FX';
	
	var muteTrueIcon = '&#xf038';
	var muteFalseIcon = '&#xf03b';

	db.get('music_enabled').then(function(doc) {
		var muteIcon = document.getElementById("mute-icon1");
		if(doc.title){
			document.getElementById("mute-musicbtn").innerHTML = muteMusicFalseText;
			muteIcon.innerHTML = muteFalseIcon;
			muteIcon.style.fill = "black";
		} else {
			document.getElementById("mute-musicbtn").innerHTML = muteMusicTrueText;
			muteIcon.innerHTML = muteTrueIcon;
			muteIcon.style.fill = "red";
		}
	})

	db.get('sound_enabled').then(function(doc) {
		var muteIcon = document.getElementById("mute-icon2");
		if(doc.title){
			document.getElementById("mute-soundbtn").innerHTML = muteSoundFXFalseText;
			muteIcon.innerHTML = muteFalseIcon;
			muteIcon.style.fill = "black";
		} else {
			document.getElementById("mute-soundbtn").innerHTML = muteSoundFXTrueText;
			muteIcon.innerHTML = muteTrueIcon;
			muteIcon.style.fill = "red";
		}
	})

	db.get('network_username').then(function(doc) {
		if(document.getElementById("usernameInput") != null){
			if(doc.title){
				document.getElementById("usernameInput").value = doc.title;
			} else {
				document.getElementById("usernameInput").value = '';
			}
		}
	})

	$scope.saveUsername = function(username){
		if(username == '' || username == undefined){
			username = 'TempPlayer' + _.random(0, 100);
			$scope.username = username;
		}

		db.get('network_username').then(function(doc) {
			return db.put({
				_id: 'network_username',
				_rev: doc._rev,
				title: username
			});
		}).then(function(response) {
		  // handle response
		  console.log('username updated');
		}).catch(function (err) {
		  console.log(err);
		});
	}

	$scope.toggleMusic = function() {
		
		var muteText = document.getElementById("mute-musicbtn").innerHTML;
		muteIcon = document.getElementById("mute-icon1");
		
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
			  Audio.background.stop();
			}).catch(function (err) {
			  console.log(err);
			});
			document.getElementById("mute-musicbtn").innerHTML = muteMusicTrueText;
			muteIcon.innerHTML = muteTrueIcon;
			muteIcon.style.fill = "red";
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
			  Audio.background.play();
			}).catch(function (err) {
			  console.log(err);
			});
			document.getElementById("mute-musicbtn").innerHTML = muteMusicFalseText;
			muteIcon.innerHTML = muteFalseIcon;
			muteIcon.style.fill = "black";
		}
	}

	$scope.toggleSound = function() {
		
		var muteText = document.getElementById("mute-soundbtn").innerHTML;
		var muteIcon = document.getElementById("mute-icon2");
		
		if (muteText.indexOf("Unmute") == -1)
		{			
			db.get('sound_enabled').then(function(doc) {
				return db.put({
					_id: 'sound_enabled',
					_rev: doc._rev,
					title: false
				});
			}).then(function(response) {
			  // handle response
			  Audio.togglesound = false;
			}).catch(function (err) {
			  console.log(err);
			});
			document.getElementById("mute-soundbtn").innerHTML = muteSoundFXTrueText;
			muteIcon.innerHTML = muteTrueIcon;
			muteIcon.style.fill = "red";
		}
		else
		{
			db.get('sound_enabled').then(function(doc) {
				return db.put({
					_id: 'sound_enabled',
					_rev: doc._rev,
					title: true
				});
			}).then(function(response) {
			  // handle response
			  Audio.togglesound = true;
			}).catch(function (err) {
			  console.log(err);
			});
			document.getElementById("mute-soundbtn").innerHTML = muteSoundFXFalseText;
			muteIcon.innerHTML = muteFalseIcon;
			muteIcon.style.fill = "black";
		}
	}
	
});


