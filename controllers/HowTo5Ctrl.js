muonApp.controller('HowTo5Ctrl', function ($scope, $stateParams) {
  var stepOne = document.getElementById('stepOne');
  var playerOne = Typer(stepOne, ['You are ready! Hit the play button in the bottom right to get started']);

  playerOne.play(function(){
    
  });
});