var tutorial = {
	IS_TUTORIAL: false,
	index: 0,
	isFirstMove: true,
	updateFlagSlide: function(){
		var lower = document.getElementById('lower-content');
		lower.classList.remove('fade-out');
	},
	quadCleared: function(){
		var lower = document.getElementById('bottom-content');
		lower.classList.remove('fade-out');
	},
	tutorialWin: function(){
		var lower = document.getElementById('lower-content');
		lower.innerHTML = 'Great job! However, when you play for real, the anti-muons will be fighting back! You are ready for action, hit play to start a game!';
		lower.classList.remove('fade-out');
	}
}