var bebop = require('node-bebop');

var drone = bebop.createClient();

drone.connect(function() {
  
  //adjusting max values
	drone.PilotingSettings.maxAltitude(10);
	drone.SpeedSettings.maxVerticalSpeed(1);
  drone.SpeedSettings.hullProtection(1);

  //take off
  drone.takeoff();

  setTimeout(function() {
    drone.up();
  }, 3000);

  setTimeout(function() {
    drone.stop();
  }, 5500);
  
  setTimeout(function(){
    drone.right(20);
  }, 6000);
  setTimeout(function(){
    drone.up(100);
  }, 6000);
  setTimeout(function(){
    drone.down(80);
  }, 12000);
  setTimeout(function(){
    drone.right(20);
  }, 12000);
  setTimeout(function(){
    drone.down(80);
  }, 18000);
  setTimeout(function(){
    drone.left(20);
  }, 18000);
  setTimeout(function(){
    drone.up(100);
  }, 24000);
  setTimeout(function(){
    drone.left(20);
  }, 24000);

  setTimeout(function() {
    drone.stop();
  }, 30000);

  
  setTimeout(function() {
    drone.land();
  }, 31000);

  //events
  var predata = 0;
  drone.on("battery", function (data) {
    if(data < 10){
      console.log("Battery low - " + data.toString() +"%");
      drone.land();
    }
    else if (data<30){
      if (predata!=data){
        console.log("Battery percentage is: " + data.toString());
        predata = data;
      }
    }
    
  });

  drone.on("ready", function(){
    console.log("Drone is connected!");
  });
  
  
  drone.on("takingOff", function(){
    console.log("Drone is taking off now!");
  });

  drone.on("emergency", function(){
    console.log("Drone is emergency state!");
  });

  drone.on("landed", function(){
    console.log("Drone has landed now!");
  });
});