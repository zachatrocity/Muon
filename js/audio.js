// Plays audio files

var _menuOver = new Howl({
  urls: ['audio/menuOver.wav']
});

// var _menuSelect = new Howl({
//   urls: ['audio/menuSelect.wav']
// });

var _move = new Howl({
  urls: ['audio/move.wav']
});

var _winner = new Howl({
  urls: ['audio/winner.wav']
});

var _loser = new Howl({
  urls: ['audio/loser.wav']
});

var _background = new Howl({
  urls: ['audio/hive.ogg'],
  loop: true,
  autoplay: true
});

// The audio object that will contain arrays of songs to play for various actions
var Audio = {
    menuOver: _menuOver,
    //menuSelect: _menuSelect,
    move: _move,
    winner: _winner,
    loser: _loser,
    background: _background
};