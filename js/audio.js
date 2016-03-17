// Plays audio files

var _menuOver = new Howl({
  urls: ['audio/menu_hover.ogg']
});

var _menuSelect = new Howl({
  urls: ['audio/menu_click.ogg']
});

var _move = new Howl({
  urls: ['audio/muon_move.ogg'],
  sprite: {
    one: [0,1400],
    two: [3700, 1600],
    three: [7400, 1400],
    four: [11200, 1400],
    five: [15000, 1400],
    six: [18700, 1400],
    seven: [22450, 1400],
    eight: [26200, 1400]
  }
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
  autoplay: false
});

// The audio object that will contain arrays of songs to play for various actions
var Audio = {
    menuOver: _menuOver,
    menuSelect: _menuSelect,
    move: _move,
    winner: _winner,
    loser: _loser,
    background: _background,
    togglesound: true,
    playRandomMove: function(){
      if(Audio.togglesound)
        Audio.move.play(_.shuffle(_.keys(Audio.move.sprite()))[_.random(0,7)]);
    }
};