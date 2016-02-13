//wrapper for all DOM manipulation
var NetworkGUI = {
  getPlayerCountElement: function() {
    return document.getElementById('onlinePlayerCount');
  },
  setPlayerCountElement: function(value) {
    document.getElementById('onlinePlayerCount').innerHTML = value;
  },
  getLobbyElement: function() {
    return document.getElementById("lobby-list");
  },
  refreshLobbyElement: function(data) {
    var users = data.users;
    var inLobby = data.inLobby;
    var lobbyListElement = NetworkGUI.getLobbyElement();
    lobbyListElement.innerHTML = '';
    _.chain(users)
      .each(function(user) {
        if (inLobby) {
          lobbyListElement.innerHTML += '<li>' + unescape(user.name) + '</li>';
        }
      });
  },
  getRoomElement: function() {
    return document.getElementById("room-list");
  },
  refreshRoomElement: function(rooms) {
    var roomListElement = NetworkGUI.getRoomElement();

    roomListElement.innerHTML = '';
      _.each(rooms, function(room) {
        roomListElement.innerHTML += '<li>' + unescape(room.name) + ' (' + room.users.length + '/' + room.size + ') <a href="#" onclick="game.joinRoom(\'' + room.id  + '\')">join</a></li>';
      });
    roomListElement.innerHTML += '</ul>';
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
        // game.room.id = result.roomId;
        // game.begin();
        //start game!
      }
    }

  }
});
