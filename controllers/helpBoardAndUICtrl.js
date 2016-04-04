muonApp.controller('helpBoardAndUICtrl', function ($scope, $stateParams, $state) {

    var index = $stateParams.index;
    var flagG = document.getElementById("flagG");
    var flagB = document.getElementById("flagB");
    var stepContainer = document.getElementById('stepContainer');
    var stepContent = document.getElementById('step-content');
    var lowerContent = document.getElementById('lower-content');
    var slideOneText = 'This is the inside of an atom. The atom is made up of four sections called quadrants. Muons or Anti-muons will gain control of the atom if they form a triangle in any of the 4 quadrants.';
    var slideTwoText = 'The glowing green (Muon) and blue (Anti-muon) quadrants are the effects of radiation on that quadrant. In order to be able to win in your home quadrant, you must move all pieces completely out of the quadrant, to deplete the radiation.';
    var slideThreeText = 'The black circles within the quadrants are called voids. Muons can only move through the atom by placing themselves in these voids.';
    var slideFourText = 'This is the game menu. You can hover over each of the buttons to see what they do.';    
    var slideFiveText = 'These are the stats. The top bar shows how many moves have been made. The bottom bar is the turn indicator.';    

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
      if(index == 2){
        replaceSlide(slideTwoText);
        setTimeout(function(){
          flagG.classList.remove("fade-out");
          flagB.classList.remove("fade-out");
        },500)
      } else if(index == 3){
        replaceSlide(slideThreeText);
      } else if(index == 4){
        replaceLowerSlide(slideFourText);
        document.getElementById("menu_slide").style.display = 'block';
        setTimeout(function(){
          document.getElementById("menu_slide").classList.remove('fade-out');
        },1000);
      } else if(index == 5){
        replaceLowerSlide(slideFiveText);
        document.getElementById("stats_slide").classList.remove('fade-out');
      } else {
        $state.go('help3', {});
      }
    }

    $scope.prev_slide = function(){
      index--;
      if(index == 1){
        replaceSlide(slideOneText);
        setTimeout(function(){
          flagG.classList.add("fade-out");
          flagB.classList.add("fade-out");
        },500)
      } else if(index == 2){
        replaceSlide(slideTwoText);
      } else if(index == 3){
        document.getElementById("menu_slide").classList.add('fade-out');
        setTimeout(function(){document.getElementById("menu_slide").style.display = 'none';}, 1000);
        replaceSlide(slideThreeText);
      } else if(index == 4){
        document.getElementById("stats_slide").classList.add('fade-out');
        replaceLowerSlide(slideFourText);
      } else {
        $state.go('howto', {});
      }
    }

    var setSlide = function(){
      if(index == 2){
        replaceSlide(slideTwoText);
        setTimeout(function(){
          flagG.classList.remove("fade-out");
          flagB.classList.remove("fade-out");
        },500)
      } else if(index == 3){
        replaceSlide(slideThreeText);
      } else if(index == 4){
        replaceLowerSlide(slideFourText);
        document.getElementById("menu_slide").style.display = 'block';
        setTimeout(function(){
          document.getElementById("menu_slide").classList.remove('fade-out');
        },1000);
      } else if(index == 5){
        replaceLowerSlide(slideFiveText);
        document.getElementById("menu_slide").style.display = 'block';
        document.getElementById("stats_slide").classList.remove('fade-out');
        document.getElementById("menu_slide").classList.remove('fade-out');
      }
    }

    setSlide();

});