muonApp.controller('MenuCtrl', function ($scope, $stateParams, $state) {

	
	var allLinks = document.getElementsByTagName('a');
	if(LISTENERSET == false)
	{
		LISTENERSET = true;
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
					
					if(Audio.togglesound)
						Audio.menuOver.play();
					
					break;
				// Up/left key
				case 37: case 38:
					if (currentIndex == 1 || currentIndex == -1)
					{
						currentIndex = 7;
					}
					allLinks[currentIndex - 2].focus();	
					
					if(Audio.togglesound)	
						Audio.menuOver.play();
					
					break;
			
			}
		});
	} 

	$scope.usernameInputChanged = function(username){
		if(username != undefined){
			if(username.trim() != ''){
				//enable connect button
				document.getElementById('connectButton').classList.remove('disabled');
				document.getElementById('connectButton').classList.add('green');
				document.getElementById('connectButton').classList.add('greenhover');
			}
		} else {
			document.getElementById('connectButton').classList.remove('green');
			document.getElementById('connectButton').classList.remove('greenhover');
			document.getElementById('connectButton').classList.add('disabled');
		}
	}
	
	$scope.saveNetworkingUsername = function(username){
		if(username != undefined){
			$scope.showNetworkingModal = false;
			//save username
			db.get('network_username').then(function(doc) {
				return db.put({
					_id: 'network_username',
					_rev: doc._rev,
					title: username
				});
			}).then(function(response) {
			  // handle response
			  console.log('username updated');
			  Network.username = username;
			}).catch(function (err) {
			  console.log(err);
			});

			//go to network
			$state.go('network', {'username':username});
		}
	}

	$scope.showNetworkModal = function(){

		// db.get('network_username').then(function(doc) {
		// 	if(doc.title && doc.title != ''){ //if there is a username then go to networking
				
		// 	} else { //else create a new one
		// 		$scope.showNetworkingModal = true;
		// 		setTimeout(function(){
		// 			document.getElementById('usernameInput').focus();
		// 		},1000);		
		// 	}
		// })

		if(Network.username == '' || Network.username == undefined){
			$scope.showNetworkingModal = true;
			setTimeout(function(){
				document.getElementById('usernameInput').focus();
			},1000);
		} else {
			$state.go('network', {});
		}
	}

	$scope.mouse_over = function(id) {
		if(Audio.togglesound)
			Audio.menuOver.play();
		
		var item = document.getElementById('item' + id);
		if(item != undefined){
			item.focus();		
		}
 	}
	
	$scope.mouse_click = function() {
		if(Audio.togglesound)
			Audio.menuSelect.play();
	}
})
