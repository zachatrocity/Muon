//wrapper for all DOM manipulation
var NetworkGUI = {
  getPlayerCountElement: function() {
    return document.getElementById('onlinePlayerCount');
  },
  setPlayerCountElement: function(value) {
    if(document.getElementById('onlinePlayerCount') != null)
      document.getElementById('onlinePlayerCount').innerHTML = value;
  },
  getLobbyElement: function() {
    return document.getElementById("lobby-list");
  },
  refreshLobbyElement: function(data) {
    var users = data.users;
    var inLobby = data.inLobby;
    var lobbyListElement = NetworkGUI.getLobbyElement();
    if(lobbyListElement != null){
      lobbyListElement.innerHTML = '';
      _.chain(users)
        .each(function(user) {
          if (inLobby) {
            lobbyListElement.innerHTML += '<li>' + unescape(user.name) + '</li>';
          }
        });
    }
  },
  getRoomElement: function() {
    return document.getElementById("room-list");
  },
  refreshRoomElement: function(rooms) {
    var roomListElement = NetworkGUI.getRoomElement();
    if(roomListElement != null){
      roomListElement.innerHTML = '';
        _.each(rooms, function(room) {
          roomListElement.innerHTML += '<li>' + unescape(room.name) + ' (' + room.users.length + '/' + room.size + ') <a href="#/board/' + room.id + '/0">join</a></li>';
        });
      roomListElement.innerHTML += '</ul>';
    }
  }
}

var BoardGUI = {
  getBoardHeaderElement: function() {
    return document.getElementById('boardHeaderText');
  },
  setBoardHeaderElement: function(value) {
    document.getElementById('boardHeaderText').innerHTML = value;
  }
}


cloak.configure({
  messages: {
    'registerUsernameResponse': function(success) {
      console.log(success ? 'username registered' : 'username failed');
      // if we registered a username, try to join the lobby
      if (success) {
        // get the lobby
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
        ///board/:roomid/:waiting
        window.location.hash = "#/board/" + result.roomId + "/1";
        // game.begin();
        //start game!
      }
    },
    
    'joinRoomResponse': function(result) {
      if (result.success) {
        console.log("room joined");

        // game.room.id = result.id;
        // game.begin();
        // game.refreshWaiting();
      } else {
        console.log("room is full");
      }
    },

    'refreshRoomResponse': function(members){
      if (!members) {
        return;
      }

      if (members.length < 2) {
        BoardGUI.setBoardHeaderElement("Game Started");
      }
    },

    //game
    'assignTeam': function(data) {
      console.log('my team is', data.team);
      gameCore.team = data.team;
      gameCore.otherTeam = (gameCore.team === 'muon') ? 'antimuon' : 'muon';
      gameCore.turn = data.turn;
      BoardGUI.setBoardHeaderElement("Turn:" + gameCore.turn);
    },

    'turn': function(msg) {
      gameCore.turn = msg;
      console.log('Turn: ' + gameCore.turn);
      BoardGUI.setBoardHeaderElement("Turn:" + gameCore.turn);
      cloak.message('refreshRoom');
    }


  },
  serverEvents: {
    'connect': function() {
      console.log('connect');
    },

    'disconnect': function() {
      console.log('disconnect');
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
      // The other player dropped, so we need to stop the game and show return to lobby prompt
      // game.showGameOver('The other player disconnected!');
      // cloak.message('leaveRoom');
      console.log('Removing you from the room because the other player disconnected.');
    },

    'begin': function() {
      console.log('begin');
      cloak.message('listRooms');
    }
  }
});
