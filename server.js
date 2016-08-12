var bebop = require('node-bebop');

var drone = bebop.createClient();

drone.connect(function() {
  
  //adjusting max values
	drone.PilotingSettings.maxAltitude(2);
	SpeedSettings.maxVerticalSpeed(0.2);


  //take off
	drone.takeOff();


  //actions
	setTimeout(function() {
    	drone.up(1);
  }, 3000);

  setTimeout(function() {
  	  	drone.stop();
 	 }, 4000);

  setTimeout(function() {
   	 	drone.down(1);
  }, 2000);

 	setTimeout(function() {
    	drone.stop();
  }, 5000);

  setTimeout(function() {
    	drone.land();
  }, 7000);


  //events
  drone.on("battery", function (data) {
    if(data < 20){
      console.log("Battery low!" + data.toString());
      drone.emergency();
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
  })

});