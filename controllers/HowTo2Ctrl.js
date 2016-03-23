muonApp.controller('HowTo2Ctrl', function ($scope, $stateParams) {

    var index = 0;
    var stepOne = document.getElementById('stepOne');
    var stepTwo = document.getElementById('stepTwo');
    var stepThree = document.getElementById('stepThree');
    var playerOne = Typer(stepOne, ['This is the inside of an atom. The atom is made up of four sections called quadrants. Muons or Anti-muons will gain control of the atom if they form a triangle in any of the 4 quadrants.']);
    var playerTwo = Typer(stepTwo, ['The glowing green (Muon) and blue (Anti-muon) quadrants are the effects of radiation on that quadrant. In order to be able to win in your home quadrant, you must move all pieces completely out of the quadrant, to deplete the radiation.']);
    var playerThree = Typer(stepThree, ['The black circles within the quadrants are called voids. Muons can only move through the atom by placing themselves in these voids.']);

    playerOne.play(function(){
      playerTwo.play(function(){
      	playerThree.play();
      });
    });

});