muonApp.controller('helpBoardAndUICtrl', function ($scope, $stateParams, $state) {

    var index = $stateParams.index;
    var flagG = document.getElementById("flagG");
    var flagB = document.getElementById("flagB");
    var board = document.getElementById('board-componant');
    var winBoard = document.getElementById('sample-win-board');
    var winBoardText = 'The red electricity here shows an example of two possible winning triangles.';
    var voidCircles = document.getElementById('voidPlaces');
    var stepContainer = document.getElementById('stepContainer');
    var stepContent = document.getElementById('step-content');
    var lowerContent = document.getElementById('lower-content');
    var slideText = [
                    'This is the inside of an atom. The atom is made up of four sections called quadrants. Muons or Anti-muons will gain control of the atom if they form a triangle in any of the 4 quadrants.'
                    ,'The glowing green (Muon) and blue (Anti-muon) quadrants are the effects of radiation on that quadrant. In order to be able to win in your home quadrant, you must move all pieces completely out of the quadrant, to deplete the radiation.'
                    ,'The black circles within the quadrants are called voids. Muons can only move through the atom by placing themselves in these voids.'
                    ,'This is the game menu. You can hover over each of the buttons to see what they do. The stats are to the left of the menu. The top bar shows how many moves have been made. The bottom bar is the turn indicator.'    
                    ]

    document.getElementById("menu_slide").style.display = 'none';

    function replaceSlide(str){
      stepContainer.classList.add('fade-out');
      setTimeout(function(){
        lowerContent.innerHTML = '';  
        stepContent.innerHTML = str;        
        stepContainer.classList.remove('fade-out');
      },1000);
    }

    function replaceLowerSlide(str){
      stepContainer.classList.add('fade-out');
      setTimeout(function(){
        stepContent.innerHTML = '';    
        lowerContent.innerHTML = str;        
        stepContainer.classList.remove('fade-out');
      },1000);
    }

    $scope.next_slide = function(){
      index++;
      if(index == 1){
        replaceLowerSlide(winBoardText);
        winBoard.classList.remove("fade-out");
      } else if(index == 2){
        replaceSlide(slideText[1]);
        winBoard.classList.add("fade-out");
        setTimeout(function(){
          flagG.classList.remove("fade-out");
          flagB.classList.remove("fade-out");
        },500)
      } else if(index == 3){
        replaceSlide(slideText[2]);
        voidCircles.classList.remove('fade-out');
      } else if(index == 4){
        voidCircles.classList.add('fade-out');
        replaceLowerSlide(slideText[3]);
        document.getElementById("menu_slide").style.display = 'block';
        setTimeout(function(){
          document.getElementById("menu_slide").classList.remove('fade-out');
          document.getElementById("stats_slide").classList.remove('fade-out');
        },1000);
      } else {
        $state.go('help3', {});
      }
    }

    $scope.prev_slide = function(){
      index--;
      if(index == 0){
        replaceSlide(slideText[0]);
        winBoard.classList.add("fade-out");
      }
      else if(index == 1){
        replaceLowerSlide(winBoardText);
        winBoard.classList.remove("fade-out");
        setTimeout(function(){
          flagG.classList.add("fade-out");
          flagB.classList.add("fade-out");
        },500)
      } else if(index == 2){
        replaceSlide(slideText[1]);
        voidCircles.classList.add('fade-out');
      } else if(index == 3){
        voidCircles.classList.remove('fade-out');
        document.getElementById("menu_slide").classList.add('fade-out');
        document.getElementById("stats_slide").classList.add('fade-out');
        setTimeout(function(){document.getElementById("menu_slide").style.display = 'none';}, 1000);
        replaceSlide(slideText[2]);
      } else {
        $state.go('howto', {});
      }
    }

    var setSlide = function(){
      if(index == 2){
        replaceSlide(slideText[1]);
        setTimeout(function(){
          flagG.classList.remove("fade-out");
          flagB.classList.remove("fade-out");
        },500)
      } else if(index == 3){
        replaceSlide(slideText[2]);
      } else if(index == 4){
        replaceLowerSlide(slideText[3]);
        document.getElementById("menu_slide").style.display = 'block';
        setTimeout(function(){
          document.getElementById("menu_slide").classList.remove('fade-out');
          document.getElementById("stats_slide").classList.remove('fade-out');
        },1000);
      } 
    }

    setSlide();

});