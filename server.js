var express = require('express')
    , app = express()
    , server = require('http').Server(app)


app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

require('./drone/controller');

server.listen(3000);