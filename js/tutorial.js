var tutorial = {
	IS_TUTORIAL: false,
	index: 0,
	isFirstMove: true,
	updateFlagSlide: function(){
		var lower = document.getElementById('lower-content');
		setTimeout(function(){
			lower.innerHTML = 'Clear all of the green Muons out of their home quadrant...';
			lower.classList.remove('fade-out');
		},1000);
	},
	quadCleared: function(){
		var lower = document.getElementById('lower-content');
		lower.classList.add('fade-out');
		setTimeout(function(){
			lower.innerHTML = 'Nice work! Hit next to continue';
			lower.classList.remove('fade-out');
		},1000);
	},
	tutorialWin: function(){
		var lower = document.getElementById('lower-content');
		lower.innerHTML = 'Great job! However, when you play for real, the anti-muons will be fighting back! You are ready for action, hit play to start a game!';
		lower.classList.remove('fade-out');
	}
}