var express = require('express')
    , app = express()
    , server = require('http').Server(app)


app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

require('./drone/camera-feed');
require('./drone/controller');
require('./drone/facetrack');

server.listen(3000);