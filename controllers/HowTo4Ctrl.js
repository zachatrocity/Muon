muonApp.controller('HowTo4Ctrl', function ($scope, $stateParams) {
  gameCore.RestartGame(false);
  gameCore.tutorial.IS_TUTORIAL = true;
  gameCore.tutorial.index = 1;

  var stepOne = document.getElementById('stepOne');
  var playerOne = Typer(stepOne, ['Try to gain control of the atom by forming a triangle in one of the quadrants...']);


  playerOne.play(function(){
    
  });
});