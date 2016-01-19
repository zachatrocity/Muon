// Load native UI library
var gui = require('nw.gui'); 
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
      $urlRouterProvider.otherwise("/")
      
      $stateProvider
      	.state('menu', {
            url: "/",
            templateUrl: "views/menu.html",
            controller: function($scope){
	            
	          }
        })

        .state('newgame', {
            url: "/newgame",
            templateUrl: "views/newgame.html",
            controller: function($scope){
	            $scope.options = ["Novice", "Pro"];
	          }
        })

        .state('network', {
            url: "/network",
            templateUrl: "views/network.html"
        })

        .state('howto', {
            url: "/howto",
            templateUrl: "views/howto.html"
        })

        .state('options', {
            url: "/options",
            templateUrl: "views/options.html"
        })

        .state('about', {
            url: "/about",
            templateUrl: "views/about.html"
        })

        .state('board', {
            url: "/board",
            templateUrl: "views/board.html"
        })
    })