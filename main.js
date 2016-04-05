'use strict';
// Load native UI library
if(typeof require == 'function'){
  var gui = require('nw.gui'); 
  var packjson = require('./package.json');
}

if(gui != null){
  // Get the current window
  var win = gui.Window.get();
  win.showDevTools();
  win.on('close', function(){
    this.hide();
    gui.App.quit();
  })
}

var db = new PouchDB('optionsdb', {adapter: 'websql'});



var LISTENERSET = false;

var HACKER_MODE_ENABLED = false;
var easter_egg = new Konami(function() { alert('Hacker mode enabled.'); HACKER_MODE_ENABLED = true;});

window.addEventListener("click", hideSplash);
window.addEventListener("keydown", hideSplash);

function hideSplash() {
	var splashCont = document.getElementById("splashCont");
	var splashVid = document.getElementById("splash");
	if (splashVid.ended == false)
	{
		splashVid.pause();
	}
	splashCont.style.visibility = "hidden";
	window.removeEventListener("click", hideSplash);
	window.removeEventListener("keydown", hideSplash);
	window.addEventListener("click", hideIntro);
	window.addEventListener("keydown", hideIntro);
	document.getElementById("intro").play();
}

function hideIntro() {
	var introCont = document.getElementById("introCont");
	var introVid = document.getElementById("intro");
	if (introVid.ended == false)
	{
		introVid.pause();
	}
	window.removeEventListener("click", hideIntro);
	window.removeEventListener("keydown", hideIntro);
	introCont.style.visibility = "hidden";
}

var muonApp = angular.module('muonApp', ["ui.router", "ngAnimate"])
    muonApp.config(function($stateProvider, $urlRouterProvider){
	  
      // For any unmatched url, send to /menu
      //ANGULAR UI ROUTER
      $urlRouterProvider.otherwise("/")
      
      $stateProvider
      	.state('menu', {
            url: "/",
            templateUrl: "views/menu.html",
            controller: "MenuCtrl"
        })

        .state('newgame', {
            url: "/newgame",
            templateUrl: "views/newgame.html",
            controller: "NewGameCtrl"
        })

        .state('network', {
            url: "/network/:username",
            templateUrl: "views/network.html",
            controller: "NetworkCtrl"
        })

        .state('howto', {
            url: "/help",
            templateUrl: "views/help.html",
            controller: "HowToCtrl"
        })

        .state('helpBoardAndUI', {
            url: "/helpBoardAndUI/:index",
            templateUrl: "views/helpBoardAndUI.html",
            controller: "helpBoardAndUICtrl"
        })

        .state('help3', {
            url: "/help3",
            templateUrl: "views/help3.html",
            controller: "HowTo3Ctrl"
        })

        .state('help4', {
            url: "/help4",
            templateUrl: "views/help4.html",
            controller: "HowTo4Ctrl"
        })

        .state('options', {
            url: "/options",
            templateUrl: "views/options.html",
            controller: "OptionsCtrl"
        })

        .state('about', {
            url: "/about",
            templateUrl: "views/about.html",
            controller: "AboutCtrl"
        })

        .state('board', {
            url: "/board/:roomid/:waiting",
            templateUrl: "views/board.html",
            controller: "BoardCtrl"
        })

        .state('quit', {
            url: "/quit",
            controller: function() {
                win.close()
            }
        })

    //particle js stuff
    START_PARTICLES();
	
  //load/create the options

  db.get('music_enabled', function(err, resp) {
    if (err) {
       //does not exists so create
      db.put({
        _id: 'music_enabled',
        title: true
      }).then(function (response) {
      // handle response
        console.log(response);
        Audio.background.play();
      }).catch(function (err) {
        console.log(err);
      });
     } else {
      console.log("music_enabled: " + resp.title);
      if(resp.title){
        Audio.background.play();
      }
    }
  });

  db.get('sound_enabled', function(err, resp) {
    if (err) {
       //does not exists so create
      db.put({
        _id: 'sound_enabled',
        title: true
      }).then(function (response) {
      // handle response
        console.log(response);
        Audio.togglesound = true;
      }).catch(function (err) {
        console.log(err);
      });
     } else {
      console.log("sound_enabled: " + resp.title);
      Audio.togglesound = resp.title;
    }
  });

  db.get('network_username', function(err, resp) {
    if (err) {
       //does not exists so create
      db.put({
        _id: 'network_username',
        title: ''
      }).then(function (response) {
      // handle response
        console.log(response);
      }).catch(function (err) {
        console.log(err);
      });
     } else {
      console.log("network_username: " + resp.title);
    }
  });

  db.get('network_GUID', function(err, resp) {
    if (err) {
       //does not exists so create
      db.put({
        _id: 'network_GUID',
        title: uuid.v4()
      }).then(function (response) {
        db.get('network_GUID', function(er, res){
          if(!er){
            Network.userId = res.title;
          }
        })
      }).catch(function (err) {
        console.log(err);
      });
     } else {
      console.log("network_GUID: " + resp.title);
      Network.userId = resp.title
    }
  });

})

muonApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

muonApp.directive('sbLoad', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var fn = $parse(attrs.sbLoad);
        elem.on('load', function (event) {
          scope.$apply(function() {
            fn(scope, { $event: event });
          });
        });
      }
    };
  }]);