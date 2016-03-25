muonApp.controller('helpBoardAndUICtrl', function ($scope, $stateParams, $state) {

    var index = 1;
    var stepOne = document.getElementById('stepOne');
    var stepTwo = document.getElementById('stepTwo');
    var stepThree = document.getElementById('stepThree');
    var playerOne = Typer(stepOne, ['This is the inside of an atom. The atom is made up of four sections called quadrants. Muons or Anti-muons will gain control of the atom if they form a triangle in any of the 4 quadrants.']);
    var playerTwo = Typer(stepOne, ['The glowing green (Muon) and blue (Anti-muon) quadrants are the effects of radiation on that quadrant. In order to be able to win in your home quadrant, you must move all pieces completely out of the quadrant, to deplete the radiation.']);
    var playerThree = Typer(stepOne, ['The black circles within the quadrants are called voids. Muons can only move through the atom by placing themselves in these voids.']);
    var playerFour = Typer(stepOne, ['This is the game menu. You can hover over each of the buttons to see what they do.']);    
    var playerFive = Typer(stepOne, ['These are the stats. The top bar shows how many moves have been made. The middle bar is the clock which tells you how long you have been playing. Finally, the bottom bar is the turn indicator.']);    

    playerOne.play();

    $scope.next_slide = function(){
      index++;
      if(index == 2){
        playerOne.stop()
        playerTwo.play()
      } else if(index == 3){
        playerTwo.stop()
        playerThree.play();
      } else if(index == 4){
        playerThree.stop()
        playerFour.play();
        document.getElementById("menu_slide").classList.remove('fade-out');
      } else if(index == 5){
        playerFour.stop()
        playerFive.play();
        document.getElementById("stats_slide").classList.remove('fade-out');
      } else {
        $state.go('help3', {});
      }
    }

    $scope.prev_slide = function(){
      index--;
      if(index == 1){
        playerTwo.stop()
        playerOne.play()
      } else if(index == 2){
        playerThree.stop()
        playerTwo.play();
      } else if(index == 3){
        playerFour.stop()
        playerThree.play();
        document.getElementById("menu_slide").classList.add('fade-out');
      } else if(index == 4){
        playerFive.stop()
        playerFour.play();
        document.getElementById("stats_slide").classList.add('fade-out');
      } else {
        $state.go('howto', {});
      }
    }

});