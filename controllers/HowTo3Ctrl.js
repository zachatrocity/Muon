muonApp.controller('HowTo3Ctrl', function ($scope, $stateParams) {
    
    gameCore.RestartGame(false);
    gameCore.tutorial.IS_TUTORIAL = true;
    gameCore.tutorial.index = 0;

    var stepOne = document.getElementById('stepOne');
    var playerOne = Typer(stepOne, ['Give it a shot! Clear the green Muons out of their home quadrant...']);
    

    playerOne.play(function(){
      
    });

});