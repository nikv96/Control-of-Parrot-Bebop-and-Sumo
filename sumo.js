var sumo = require('node-sumo');

var drone = sumo.createClient();

drone.connect(function() {

  drone.on("postureStuck", function(){
    console.log("Drone is stuck");
  });

  drone.on("postureKicker", function(){
    console.log("Drone is in kicker posture.");
  });

  drone.on("postureJumper", function(){
    console.log("Drone is in jumper posture posture.");
    drone.animationsHighJump();
  });

  drone.on("ready", function(){
    console.log("Drone is connected and ready!");
  });

  drone.on("batteryLow", function(){
    console.log("Battery is low.")
  });
  drone.on("jumpMotorErrorBlocked", function(){
    console.log("Motor is blocked!")
  });

  var t = 0;

  while(t<80000){
    setTimeout(function(){
      drone.postureJumper();
    }, t);
    
    setTimeout(function() {
      drone.backward(50);
    }, t+3000);

    t = t+1000;
  }

  setTimeout(function() {
    drone.stop();
  }, 82000);
});