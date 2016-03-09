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
  addTestLobbyElemnts: function(){
    var lobbyListElement = NetworkGUI.getLobbyElement();
    if(lobbyListElement != null){
      lobbyListElement.innerHTML = '';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
      lobbyListElement.innerHTML += '<li>' + unescape("zach") + '</li>';
    }
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
  addTestRoomElement: function(){
    var roomListElement = NetworkGUI.getRoomElement();
    if(roomListElement != null){
      roomListElement.innerHTML = '';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("jacob's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("jordan's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span><a class="button join-btn" href="#/board/' + 123 + '/0">join</a></li>';
      roomListElement.innerHTML += '';
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
          roomListElement.innerHTML += '<li><span>' + unescape(room.name) + ' (' + room.users.length + '/' + room.size + ')</span><a class="button join-btn" href="#/board/' + room.id + '/0">join</a></li>';
        });
    }
  }
}

var BoardGUI = {
  getBoardHeaderElement: function() {
    return document.getElementById('boardHeaderText');
  },
  setBoardHeaderElement: function(value) {
    document.getElementById('boardHeaderText').innerHTML = value;
  },
  appendChatMessage: function(msg, isMyMessage){
    var messages = document.getElementById("messages");
    if(isMyMessage) //left align
      messages.innerHTML += '<li class="sent">' + msg + '</li>'
    else
      messages.innerHTML += '<li class="received">' + msg + '</li>'

    messages.scrollTop = messages.scrollHeight
  },
  clearChatMessages: function(){
    document.getElementById("messages").innerHTML = '';
  },
  showWaitingModal: function(){
    var modal = document.getElementById("waiting_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideWaitingModal: function(){
    var modal = document.getElementById("waiting_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showWinModal: function(){
    var modal = document.getElementById("win-modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
      modal.getElementsByTagName("input")[0].classList.add("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.add("show-modal-btn");
    }
  },
  hideWinModal: function(){
    var modal = document.getElementById("win-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
      modal.getElementsByTagName("input")[0].classList.remove("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.remove("show-modal-btn");
    }
  },
  showLoseModal: function(){
    var modal = document.getElementById("lose-modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
      modal.getElementsByTagName("input")[0].classList.add("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.add("show-modal-btn");
    }
  },
  hideLoseModal: function(){
    var modal = document.getElementById("lose-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
      modal.getElementsByTagName("input")[0].classList.remove("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.remove("show-modal-btn");
    }
  },
  showDrawModal: function(){
    var modal = document.getElementById("draw-modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
      modal.getElementsByTagName("input")[0].classList.add("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.add("show-modal-btn");
    }
  },
  hideDrawModal: function(){
    var modal = document.getElementById("draw-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
      modal.getElementsByTagName("input")[0].classList.remove("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.remove("show-modal-btn");
    }
  }
}

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
              BoardGUI.setBoardHeaderElement("Your Turn");
              BoardGUI.hideWaitingModal();  
            } else {
              BoardGUI.setBoardHeaderElement("Their Turn");
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

