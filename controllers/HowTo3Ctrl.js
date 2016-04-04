muonApp.controller('HowTo3Ctrl', function ($scope, $stateParams, $state) {
    
    gameCore.RestartGame(false);
    gameCore.tutorial.IS_TUTORIAL = true;
    gameCore.tutorial.index = 0;
    gameCore.tutorial.isFirstMove = true;

    $scope.prev_slide = function(){
        $state.go('helpBoardAndUI', {index:5});
    }

});