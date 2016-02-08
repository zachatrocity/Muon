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

    'listUsersResponse': function(users) {
      console.log(users);
      document.getElementById('onlinePlayerCount').innerHTML = users.data.length;
    },

    'joinLobbyResponse': function(success) {
      console.log('joined lobby');
      cloak.message('listUsers');
    }

  }
});
