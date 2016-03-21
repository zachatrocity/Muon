var Network = {
  isConnected: false,
  username: '',
  configureNetwork: function(){
    cloak.configure({
      messages: {
        'registerUsernameResponse': function(data) {
          console.log(data[0] ? 'username registered' : 'username failed');
          // if we registered a username, try to join the lobby
          if (data[0]) {
            // get the lobby
            cloak.username = data[1];
            cloak.message('joinLobby');
          }
        },

        'userMessage': function(msg) {
          console.log('The server says: ' + msg);
        },

        'refreshAll':function(){
          cloak.message('listUsers');
          cloak.message('listRooms');
        },

        'refreshLobby': function(data) {
          console.log(data);
          //set the player count
          NetworkGUI.setPlayerCountElement(data.users.length);
          //show the online users
          NetworkGUI.refreshLobbyElement(data);
        },

        'refreshRooms': function(rooms){
          console.log(rooms);
          NetworkGUI.refreshRoomElement(rooms);
        },

        'joinLobbyResponse': function(success) {
          if(success){
            console.log('joined lobby');
            cloak.message('listUsers');
          }
        },

        'roomCreated': function(result) {
          console.log(result.success ? 'room join success' : 'room join failure');
          if (result.success) {
            gameCore.network.roomid = result.roomId;
            ///board/:roomid/:waiting
            window.location.hash = "#/board/" + result.roomId + "/1";
            //start game!
          }
        },
        
        'joinRoomResponse': function(result) {
          if (result.success) {
            console.log("room joined");
            gameCore.network.roomid = result.id;
            BoardGUI.clearChatMessages();
            cloak.message('refreshRoom');
          } else {
            console.log("room is full");
          }
        },

        'chat': function(data) {
          //chat received
          //data[0] is the message and data[1] is the username that sent it
          console.log(data[0]);
          BoardGUI.appendChatMessage(data[0], (data[1] == cloak.username));
        },

        'refreshRoomResponse': function(members){
          if (!members) {
            return;
          }

          if (members.length > 1) {
            if(gameCore.network.turn == gameCore.network.team){
              BoardGUI.appendSystemMessage("Your Turn");
              BoardGUI.hideWaitingModal(); 
              BoardGUI.timer.reset(); 
            } else {
              BoardGUI.appendSystemMessage("Their Turn");
            }
          }
        },

        //game
        'assignTeam': function(data) {
          console.log('my team is', data.team);
          gameCore.network.team = data.team;
          gameCore.network.otherTeam = (gameCore.network.team === 'muon') ? 'antimuon' : 'muon';
          gameCore.network.turn = data.turn;
        },

        'turn': function(msg) {
          gameCore.network.turn = msg;
          console.log('Turn: ' + gameCore.network.turn);
          cloak.message('refreshRoom');
        },

        'performOpponentMove': function(data) {
          console.log('opponent moved!!!!!!', data);
          gameCore.network.MakeOpponentMove(data[0], data[1]);
        },

        'proposeDrawResponse': function(data){
          if(cloak.username == data[0]){
            console.log("you proposed a draw");
            BoardGUI.showWaitingModal();
          } else {
            BoardGUI.hideAllModals();
            console.log("opponent would like to draw");
            BoardGUI.showNetworkDrawModal();
          }
        },

        'respondToDrawResponse':function(data){
          if(data[0]){
            //draw was accepted
            BoardGUI.hideAllModals();
            BoardGUI.showDrawModal();
          } else {
            //draw was declined
            BoardGUI.hideAllModals();
            BoardGUI.appendSystemMessage("Opponant declined to draw.");
          }
        },

        'proposeRematchResponse': function(data){
          if(cloak.username == data[0]){
            console.log("you proposed a Rematch");
            BoardGUI.hideAllModals();
            BoardGUI.showWaitingModal();
          } else {
            BoardGUI.hideAllModals();
            console.log("opponent would like to Rematch");
            BoardGUI.showNetworkRematchModal();
          }
        },

        'respondToRematchResponse':function(data){
          if(data[0]){
            //Rematch was accepted
            BoardGUI.hideAllModals();
            BoardGUI.timer.reset();
          } else {
            //Rematch was declined
            BoardGUI.hideAllModals();
            BoardGUI.appendSystemMessage("Opponant declined to Rematch.");
          }
        }

      },
      serverEvents: {
        'connect': function() {
          console.log('connect');
          Network.isConnected = true;
        },

        'disconnect': function() {
          console.log('disconnect');
          Network.isConnected = false;
        },

        'resume': function() {
          console.log('RESUMING!!');
        },

        'lobbyMemberJoined': function(user) {
          console.log('lobby member joined', user);
          cloak.message('listUsers');
        },

        'lobbyMemberLeft': function(user) {
          console.log('lobby member left', user);
          cloak.message('listUsers');
        },

        'roomCreated': function(rooms) {
          console.log('created a room', rooms);
          cloak.message('listUsers');
          cloak.message('listRooms');
        },

        'roomDeleted': function(rooms) {
          console.log('deleted a room', rooms);
          cloak.message('listUsers');
          cloak.message('listRooms');
        },

        'roomMemberJoined': function(user) {
          console.log('room member joined', user);
          cloak.message('refreshRoom');
        },

        'roomMemberLeft': function(user) {
          console.log('room member left', user);
          cloak.message('leaveRoom');
          console.log('Removing you from the room because the other player disconnected.');
        },

        'begin': function() {
          console.log('begin');
          cloak.message('listRooms');
        }
      }
    });
  }
}

Network.configureNetwork();

