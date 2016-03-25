muonApp.controller('HowTo3Ctrl', function ($scope, $stateParams) {
    
    gameCore.RestartGame(false);
    gameCore.tutorial.IS_TUTORIAL = true;
    gameCore.tutorial.index = 0;

    var stepOne = document.getElementById('stepOne');
    var stepTwo = document.getElementById('stepTwo');
    var playerOne = Typer(stepOne, ['Give it a shot! Click on a green Muon and then click on an adjacent void to move into it.']);
    var playerTwo = Typer(stepTwo, ['Clear all of the green Muons out of their home quadrant...']);

    playerOne.play(function(){
      playerTwo.play();
    });

});