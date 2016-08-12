var bebop = require("node-bebop");
var drone = bebop.createClient();
var mjpg = drone.getMjpegStream();
var buf = null;

drone.connect(function(){
  drone.MediaStreaming.videoEnable(1);
});

mjpg.on("data", function(data){
  buf = data;
});

var server = http.createServer(function(req, res) {
  if (!buf) {
    res.writeHead(503);
    res.end('Did not receive any jpeg data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/jpeg'});
  res.end(buf);
  });

  server.listen(8080, function() {
    console.log('Serving latest jpeg on port 8080.');
});