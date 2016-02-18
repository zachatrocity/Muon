'use strict';
// Load native UI library
var gui = require('nw.gui'); 
var packjson = require('./package.json');



// Get the current window
var win = gui.Window.get();
win.showDevTools();

var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'w' });
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}


var easter_egg = new Konami(function() { alert('Konami code!')});

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
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 3
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });  
})