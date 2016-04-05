muonApp.controller('HowTo4Ctrl', function ($scope, $stateParams) {
  gameCore.RestartGame(false);
  tutorial.IS_TUTORIAL = true;
  tutorial.index = 1;

  var stepContent = document.getElementById('step-content');
  stepContent.innerHTML = 'Try to gain control of the atom by forming a triangle in one of the quadrants...';

});