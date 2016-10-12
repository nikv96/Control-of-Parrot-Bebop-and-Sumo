var drone = require('ar-drone');

var io = require('socket.io-client'),
    socket = io.connect('localhost', {
        port: 3111
    });
socket.on('connect', function () { 
	console.log("socket connected"); 
});

socket.emit('image', { 
	image: 'whazzzup?' 
});


var client = drone.createClient();
client.getPngStream()
    .on('error', console.log)
    .on('data', function(frame) {
        socket.emit('image', { image: frame });
    });