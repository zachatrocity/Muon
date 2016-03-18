var path = require('path');
var express = require('express');

var app = express();

var staticPath = path.resolve(__dirname, './');
app.use(express.static(staticPath));

app.get('/', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile('index.html')
})

app.listen(3333, function() {
  console.log('listening');
});