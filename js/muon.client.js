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
    _.chain(users)
      .each(function(user) {
        if (inLobby) {
          lobbyListElement.innerHTML += '<li>' + escape(user.name) + '</li>';
        }
        else {
          lobbyListElement.innerHTML += '<li>' + escape(user.name) + ' (' + user.room.userCount + '/' + user.room.size + ')</li>';
        }
      });
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

    'refreshLobby': function(data) {
      console.log(data);
      //set the player count
      NetworkGUI.setPlayerCountElement(data.users.length);
      //show the online users
      NetworkGUI.refreshLobbyElement(data);
    },

    'refreshRooms': function(rooms){
      
    },

    'joinLobbyResponse': function(success) {
      if(success){
        console.log('joined lobby');
        cloak.message('listUsers');
      }
    }

  }
});
