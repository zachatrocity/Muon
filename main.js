// Load native UI library
var gui = require('nw.gui'); 
var packjson = require('./package.json');

// Get the current window
var win = gui.Window.get();
win.showDevTools();

// Listen to the minimize event
win.on('minimize', function() {
  console.log('Window is minimized');
});

var easter_egg = new Konami(function() { alert('Konami code!')});

var muonApp = angular.module('muonApp', ["ui.router"])
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
            url: "/network",
            templateUrl: "views/network.html",
            controller: "NetworkCtrl"
        })

        .state('howto', {
            url: "/howto",
            templateUrl: "views/howto.html",
            controller: "HowToCtrl"
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
            url: "/board",
            templateUrl: "views/board.html",
            controller: "BoardCtrl"
        })

        .state('quit', {
            url: "/quit",
            controller: function() {
                win.close()
            }
        })
    })