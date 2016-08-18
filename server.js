var bebop = require('node-bebop');
var stdin =process.openStdin();
var drone = bebop.createClient();

drone.connect(function() {

  stdin.addListener("data", function(d) { 
    if(d.toString()=='q\n'){
      console.log("EMERGENCY!!");
      drone.land();
    }
  });
  
  //adjusting max values
	drone.PilotingSettings.maxAltitude(10);
	drone.SpeedSettings.maxVerticalSpeed(2);
  drone.SpeedSettings.hullProtection(1);

  //take off
  //drone.land();
  drone.takeoff();

  setTimeout(function() {
    drone.stop();
  }, 5000);

  setTimeout(function(){
    drone.up(60);
  },6000);

  setTimeout(function(){
    drone.forward(2);
  }, 12000);

  setTimeout(function(){
    drone.right(5);
  }, 22000);

  setTimeout(function(){
    drone.stop();
  }, 24000);
  setTimeout(function(){
    drone.land();
  }, 26000);

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