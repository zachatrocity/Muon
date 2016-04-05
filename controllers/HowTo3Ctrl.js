muonApp.controller('HowTo3Ctrl', function ($scope, $stateParams, $state) {
    
    gameCore.RestartGame(false);
    tutorial.IS_TUTORIAL = true;
    tutorial.index = 0;
    tutorial.isFirstMove = true;

    $scope.prev_slide = function(){
        $state.go('helpBoardAndUI', {index:5});
    }
});