// Load native UI library
var gui = require('nw.gui'); 
// Get the current window
var win = gui.Window.get();
win.showDevTools();

// Listen to the minimize event
win.on('minimize', function() {
  console.log('Window is minimized');
});
