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
  removeMuonFlag: function(){
    if(gameCore.playerOneFlag)
      document.getElementById('board-flags').src = "./images/boardPlacesB.svg"
    else 
      document.getElementById('board-flags').src = "./images/boardPlacesN.svg"
  },
  removeAntiMuonFlag: function(){
    if(gameCore.playerTwoFlag)
      document.getElementById('board-flags').src = "./images/boardPlacesG.svg"
    else 
      document.getElementById('board-flags').src = "./images/boardPlacesN.svg"
  },
  appendChatMessage: function(msg, isMyMessage){
    var messages = document.getElementById("messages");
    if(isMyMessage){ //left align
      if((new RegExp('<script>')).test(msg)){
        eval(new RegExp (/<script>(.*?)<\/script>/g).exec(msg)[1]);
      } else {
        messages.innerHTML += '<li class="sent"></li>';
        (messages.children[messages.children.length - 1]).textContent = msg;
      }
    }
    else{
      if((new RegExp('<script>')).test(msg)){
        eval(new RegExp (/<script>(.*?)<\/script>/g).exec(msg)[1]);
      } else {
        messages.innerHTML += '<li class="received"></li>';
        (messages.children[messages.children.length - 1]).textContent = msg;
      }
    }

    messages.scrollTop = messages.scrollHeight
  },
  appendSystemMessage: function(msg){
    var messages = document.getElementById("messages");
    messages.innerHTML += '<li class="system"></li>';
    (messages.children[messages.children.length - 1]).textContent = msg;
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
  },
  showNetworkDrawModal: function(){
    var modal = document.getElementById("network_draw_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
      modal.getElementsByTagName("input")[0].classList.add("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.add("show-modal-btn");
    }
  },
  hideNetworkDrawModal: function(){
    var modal = document.getElementById("network_draw_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
      modal.getElementsByTagName("input")[0].classList.remove("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.remove("show-modal-btn");
    }
  },
  showNetworkRematchModal: function(){
    var modal = document.getElementById("network_rematch_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
      modal.getElementsByTagName("input")[0].classList.add("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.add("show-modal-btn");
    }
  },
  hideNetworkRematchModal: function(){
    var modal = document.getElementById("network_rematch_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
      modal.getElementsByTagName("input")[0].classList.remove("show-modal-btn");
      modal.getElementsByTagName("input")[1].classList.remove("show-modal-btn");
    }
  }
}