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
      rooms = [0,2,3,4,2,35,2,34];
      _.each(rooms, function(room) {
        roomListElement.innerHTML += '<li><span>' + unescape("zach's room") + ' (' + 1 + '/' + 2 + ')</span>' 
          + '<a href="#/board/' + 123 + '/0"><svg class="button small join-btn" width="95" height="35" viewBox="0 0 95 35">'
            + '<path id="smlbuttonbase" d="M5 10h20l10-5h55v10l-5 10v5H5z"/>'
            + '<path id="smlbuttoncornerone" d="M5 0H0v5h1V1h4z"/>'
            + '<path id="smlbuttoncornertwo" d="M90 0h5v5h-1V1h-4z"  />'
            + '<path id="smlbuttoncornerthree" d="M5 35H0v-5h1v4h4z" />'
            + '<path id="smlbuttoncornerfour" d="M95 30v5h-5v-1h4v-4z" />'    
            + '<text fill="white" x="48" y="23" text-anchor="middle" >Join</text>'
          +'</svg></a></li>';
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
          if(room.users.length >= 2){
            roomListElement.innerHTML += '<li><span>' + unescape(room.name) + ' (' + room.users.length + '/' + room.size + ')</span>' 
            + '<svg class="button small disabled join-btn" width="95" height="35" viewBox="0 0 95 35">'
              + '<path id="" d="M5 10h20l10-5h55v10l-5 10v5H5z"/>'
              + '<path id="" d="M5 0H0v5h1V1h4z"/>'
              + '<path id="" d="M90 0h5v5h-1V1h-4z"  />'
              + '<path id="" d="M5 35H0v-5h1v4h4z" />'
              + '<path id="" d="M95 30v5h-5v-1h4v-4z" />'    
              + '<text fill="black" x="48" y="23" text-anchor="middle" >Full</text>'
            +'</svg></a></li>';
          } else {
            roomListElement.innerHTML += '<li><span>' + unescape(room.name) + ' (' + room.users.length + '/' + room.size + ')</span>' 
            + '<a href="#/board/' + room.id + '/0"><svg class="button small join-btn" width="95" height="35" viewBox="0 0 95 35">'
              + '<path id="smlbuttonbase" d="M5 10h20l10-5h55v10l-5 10v5H5z"/>'
              + '<path id="smlbuttoncornerone" d="M5 0H0v5h1V1h4z"/>'
              + '<path id="smlbuttoncornertwo" d="M90 0h5v5h-1V1h-4z"  />'
              + '<path id="smlbuttoncornerthree" d="M5 35H0v-5h1v4h4z" />'
              + '<path id="smlbuttoncornerfour" d="M95 30v5h-5v-1h4v-4z" />'    
              + '<text fill="black" x="48" y="23" text-anchor="middle" >Join</text>'
            +'</svg></a></li>';
          }
        });
    }
  }
}

var BoardGUI = {
  removeMuonFlag: function(){
	var flagG = document.getElementById("flagG");
	flagG.classList.add("fade-out");
  },
  removeAntiMuonFlag: function(){
    var flagB = document.getElementById("flagB");
	flagB.classList.add("fade-out");
  },
  appendChatMessage: function(msg, user){
    var messages = document.getElementById("messages");
    if(user == Network.username){ //left align
      if((new RegExp('<script>')).test(msg)){
        eval(new RegExp (/<script>(.*?)<\/script>/g).exec(msg)[1]);
      } else {
        messages.innerHTML += '<li class="sent"></li>';
        (messages.children[messages.children.length - 1]).textContent = user + ': ' + msg;
      }
    }
    else{
      if((new RegExp('<script>')).test(msg)){
        eval(new RegExp (/<script>(.*?)<\/script>/g).exec(msg)[1]);
      } else {
        if(Audio.togglesound)
          Audio.notification.play();
        messages.innerHTML += '<li class="received"></li>';
        (messages.children[messages.children.length - 1]).textContent = user + ': ' + msg;
      }
    }

    messages.scrollTop = messages.scrollHeight
  },
  appendAIChatMessage: function(msg, isMyMessage){
    var messages = document.getElementById("messages");
    if(isMyMessage){ //left align
      if((new RegExp('<script>')).test(msg)){
        eval(new RegExp (/<script>(.*?)<\/script>/g).exec(msg)[1]);
      } else {
        messages.innerHTML += '<li class="sent"></li>';
        (messages.children[messages.children.length - 1]).textContent = 'Me: ' + msg;
      }
    }
    else{
      if((new RegExp('<script>')).test(msg)){
        eval(new RegExp (/<script>(.*?)<\/script>/g).exec(msg)[1]);
      } else {
        if(Audio.togglesound)
          Audio.notification.play();
        messages.innerHTML += '<li class="received"></li>';
        (messages.children[messages.children.length - 1]).textContent = 'AI: ' + msg;
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
  setBoardHeader: function(str){
    var header = document.getElementById("moveIndicatorHeader")
    if(header != undefined)
      header.innerHTML = str;
  },
  getBoardHeaderText: function(){
    var header = document.getElementById("moveIndicatorHeader")
    if(header != undefined)
      return header.innerHTML;
  },
  hideAllModals: function(){
    BoardGUI.hideWaitingModal();
    BoardGUI.hideResumingModal();
    BoardGUI.hideDisconnectModal();
    BoardGUI.hideWinModal();
    BoardGUI.hideLoseModal();
    BoardGUI.hideDrawModal();
    BoardGUI.hideDrawDeniedModal();
    BoardGUI.hideNetworkDrawModal();
    BoardGUI.hideNetworkRematchModal();
    BoardGUI.hideMenuModal();
  },
  showDisconnectModal: function(){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("disconnect_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideDisconnectModal: function(){
    var modal = document.getElementById("disconnect_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showResumingModal: function(){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("resuming_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideResumingModal: function(){
    var modal = document.getElementById("resuming_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  hideMenuModal: function(){
    var modal = document.getElementById("menu-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showWaitingModal: function(){
    BoardGUI.hideAllModals();
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
  showWinModal: function(str){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("win-modal")
    document.getElementById('winModalText').innerHTML = str;
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideWinModal: function(){
    var modal = document.getElementById("win-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showLoseModal: function(str){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("lose-modal");
    document.getElementById('loseModalText').innerHTML = str;
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideLoseModal: function(){
    var modal = document.getElementById("lose-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showDrawModal: function(){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("draw-modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideDrawModal: function(){
    var modal = document.getElementById("draw-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showDrawDeniedModal: function(){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("draw-denied-modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideDrawDeniedModal: function(){
    var modal = document.getElementById("draw-denied-modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showNetworkDrawModal: function(){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("network_draw_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideNetworkDrawModal: function(){
    var modal = document.getElementById("network_draw_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  },
  showNetworkRematchModal: function(){
    BoardGUI.hideAllModals();
    var modal = document.getElementById("network_rematch_modal")
    if(modal != null){
      modal.classList.add("dim-lights");
      modal.children[0].classList.add("show-modal");
    }
  },
  hideNetworkRematchModal: function(){
    var modal = document.getElementById("network_rematch_modal")
    if(modal != null){
      modal.classList.remove("dim-lights");
      modal.children[0].classList.remove("show-modal");
    }
  }
}