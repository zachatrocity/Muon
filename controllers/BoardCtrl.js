muonApp.controller('BoardCtrl', function ($scope, $stateParams, $state) {

	$scope.isNetworkGame = ($stateParams.roomid != '');

	$scope.mouse_over = function(id) {
		if(Audio.togglesound)
			Audio.menuOver.play();
 	}
	
	$scope.mouse_click = function() {
		if(Audio.togglesound)
			Audio.menuSelect.play();
	}

	$scope.handleDraw = function(){
		if(gameCore.pvp.enabled) {
			gameCore.board.moveMuonsToWinFoci(-1,-1,-1,false);
		} 
		else {
			$scope.proposeDraw();
		}
	}

	$scope.startNewGame = function(){
		BoardGUI.hideAllModals();
		// Display the flags again
		document.getElementById("flagB").classList.remove("fade-out");
		document.getElementById("flagG").classList.remove("fade-out");
		document.getElementById("moveCount").innerHTML = 0;

		// Display the board again
		var gameboards = _.filter(d3.selectAll('.gameboard')[0], function(d){ return !d.classList.contains('gamepieces')})
			_.each(gameboards, function(g){g.classList.remove('fade-out')})

		if($scope.isNetworkGame){
			gameCore.RestartGame(true);
		}
		else
			gameCore.RestartGame(false); 	

		// Check to see if the win animation is still playing
		var winAnimation = document.getElementById("winAnim");
		if (!winAnimation.ended)
		{
			winAnimation.pause();
		}

		document.getElementById("menu-hide").style.zIndex = 0;

	}	     

	$scope.proposeRematch = function(){
		$scope.startNewGame();
		cloak.message('proposeRematch');
	}     

	$scope.proposeDraw = function(){
		if($stateParams.roomid != ''){
			//propose draw over the network
			cloak.message('proposeDraw');
		} else {
			if(gameCore.ProposeDrawToAI()){
				gameCore.EndGame();
			} else {
				console.log('Proposal was denied');
				BoardGUI.showDrawDeniedModal();
			}
		}
	}

	$scope.respondToDraw = function(accept){
		cloak.message('respondToDraw',accept);
		BoardGUI.hideAllModals();
	}

	$scope.respondToRematch = function(accept){
		if(accept)
			$scope.startNewGame(); 

		cloak.message('respondToRematch',accept);
		BoardGUI.hideAllModals();
	}      
		
	$scope.returnToLobby = function(){
		$state.go('network', {'username':cloak.username});
	}

	$scope.quitToMenu = function(){
		$state.go('menu', {});
		console.log('leaving room');
		$stateParams.roomid = '';
		gameCore.network.roomid = null;
		if (Network.isConnected){
			cloak.message('leaveRoom'); 
		}
	}

	$scope.hideDrawDeniedModal = function(){
		BoardGUI.hideDrawDeniedModal();
	}

	$scope.usedChat = aichat.slice();
	
	$scope.sendChat = function(){
		if($scope.chatText != '' && $scope.chatText != undefined){
			if($stateParams.roomid != ''){
				if((new RegExp('<script>')).test($scope.chatText)){
					if(HACKER_MODE_ENABLED){
						cloak.message('chat', $scope.chatText);
					} else {
						cloak.message('chat', (new RegExp (/<script>(.*?)<\/script>/g).exec($scope.chatText)[1]));
					}
				} else {
					cloak.message('chat', $scope.chatText);
				}
				$scope.chatText = '';
			}
			else {
				//chat against the AI
				BoardGUI.appendAIChatMessage($scope.chatText, true);
				$scope.chatText = '';
				if($scope.usedChat.length == 0)
					$scope.usedChat = aichat;
				else if(aichat.length == 0)
					aichat = $scope.usedChat;
				var randex = Math.floor(Math.random() * $scope.usedChat.length) + 0;
				var zachIsAPizza = $scope.usedChat[randex];
				$scope.usedChat.splice(randex, 1);
				BoardGUI.appendAIChatMessage(zachIsAPizza, false);
			}
		}
		document.getElementById("chat-text").focus();
	}

	$scope.gameboardLoaded = function(e){
		if($stateParams.roomid == ''){
			//local game against AI
			gameCore.RestartGame(false);
		} else {
			if($stateParams.waiting == '1'){
			//angular.element(boardHeaderText)[0].innerHTML = "Waiting for opponent";
			BoardGUI.appendSystemMessage("Waiting for opponent");
			BoardGUI.showWaitingModal();
			gameCore.network.role = 'host';
			gameCore.RestartGame(true);

			} else {
				console.log("attempting to join room");
				cloak.message('joinRoom', $stateParams.roomid);
				BoardGUI.setBoardHeader(gameCore.network.turn);
				gameCore.network.role = 'client';
				gameCore.RestartGame(true);
				//client is here
				//start game
			}
		}
	}
	
});