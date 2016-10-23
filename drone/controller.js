var io = require('socket.io')(3002);
//io.set('log level', 1);

var drone = require('ar-drone');
console.log('Drone required');
var client = drone.createClient();

client.config('control:altitude_max', '20000');
var pngStream = client.getPngStream();
io.on('connection', function (socket) {
    var Controller = require('node-pid-controller');

    // Initialize PID Controllers
    var verticalPidController = new Controller(0.3, 0.01, 0.1), 
        spinPidController = new Controller(0.4, 0.01, 0.1)
        ;
    console.log('Connected');
    

    var FaceTrack = require('./facetrack');
    var faceTrack = FaceTrack(pngStream, function(info){
        console.log(info);
        var target = info.rects;
        var im = info.image;
        var targetWidth = 100;
        target.centerX = target.x + target.width * 0.5;
        target.centerY = target.y + target.height * 0.5;

        var centerX = im.width() * 0.5;
        var centerY = im.height() * 0.5;

        var heightAmount = -( target.centerY - centerY ) / centerY;
        var turnAmount = -( target.centerX - centerX ) / centerX;

        heightAmount = verticalPidController.update(-heightAmount);
        turnAmount   = spinPidController.update(-turnAmount);

        var lim = 0.1;
        if (Math.abs(target.width) > targetWidth){
            client.stop();
        } else if( Math.abs( turnAmount ) > lim || Math.abs( heightAmount ) > lim ){
        
            if(heightAmount < 0) {
                client.down(Math.abs(heightAmount));
            } else {
                client.up(heightAmount);
            }
            if(turnAmount < 0) {
                client.clockwise( Math.abs( turnAmount ) );
            }
            else{
                client.counterClockwise( turnAmount );
            }
        } else{
            client.stop();
        }

        dt = Math.min(Math.abs(turnAmount), Math.abs(heightAmount));
        dt = dt * 2000;
    });

    setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', {name: 'battery', value: batteryLevel});
    },1000);

    setInterval(function(){
        var currentAltitude = client.lastAltitude;
        socket.emit('event', { name: 'altitude',value: currentAltitude});
    },1000);

    var currentState='';

    socket.on('event', function (data) {
        if(data.name == 'facetrack'){
            if (currentState != 'facetrack'){
                currentState = 'facetrack';
                console.log('Switching to Face Track mode');
                faceTrack.start();
            } else {
                currentState = 'hover';
                client.stop();
                faceTrack.stop();
            }            
        }
        if(data.name == 'takeoff'){
            currentState='takeoff';
            console.log('Take off');
            client.takeoff();
        }
        if(data.name=='hover'){
            if(currentState!='hover'){
                console.log('Hover');
                client.stop();
                currentState='hover';
            }
        }
        if(data.name=='land'){
            currentState='land';
            console.log('Browser asked Ar Drone to Land');
            client.land();
        }
        if(data.name=='up'){
            if(currentState!='up'){
                console.log('Browser asked Ar Drone to gain Altitude');
                client.up(0.5);
                currentState='up';
            }
        }        
        if(data.name=='down'){
            currentState='down';
            console.log('Browser asked Ar Drone to lose Altitude');
            client.down(0.5);
        }
        if(data.name=='front'){
            currentState='front';
            var speed=Math.abs(data.value*1);            
            console.log('Browser asked Ar Drone to go ahead @'+speed*100+'% speed');
            client.front(speed);
            client.after(500,function(){                
                if(currentState!='hover'){
                console.log('Browser asked Ar Drone to Stay and Hover');
                client.stop();
                currentState='hover';
                }
            })
        }
        if(data.name=='back'){
            currentState='back';
            var speed=Math.abs(data.value*1);            
            console.log('Browser asked Ar Drone to go back @'+speed*100+'% speed');
            client.back(speed);
            client.after(1000,function(){                
                if(currentState!='hover'){
                console.log('Browser asked Ar Drone to Stay and Hover');
                client.stop();
                currentState='hover';
                }
            })
        }
        if(data.name=='left'){
            currentState='left';
            var speed=Math.abs(data.value*1);            
            console.log('Browser asked Ar Drone to go left @'+speed*100+'% speed');
            client.left(speed);
            client.after(1000,function(){                
                if(currentState!='hover'){
                console.log('Browser asked Ar Drone to Stay and Hover');
                client.stop();
                currentState='hover';
                }
            })
        }
        if(data.name=='right'){
            currentState='right';
            var speed=Math.abs(data.value*1);            
            console.log('Browser asked Ar Drone to go right @'+speed*100+'% speed');
            client.right(speed);
            client.after(1000,function(){                
                if(currentState!='hover'){
                console.log('Browser asked Ar Drone to Stay and Hover');
                client.stop();
                currentState='hover';
                }
            })
        }
        if(data.name=='emergency'){
            currentState='emergency';
            console.log('Browser asked Ar Drone to disable emergency');
            client.disableEmergency();
        }
        if(data.name=='flipLeft'){
            console.log('Browser asked Ar Drone to flip left');
            client.animate('flipLeft', 1000);
        }
        if(data.name=='flipAhead'){
            console.log('Browser asked Ar Drone to flip ahead');
            client.animate('flipAhead', 1000);
        }
        if(data.name=='flipBehind'){
            console.log('Browser asked Ar Drone to flip behind');
            client.animate('flipBehind', 1000);
        }
        if(data.name=='flipRight'){
            console.log('Browser asked Ar Drone to flip right');
            client.animate('flipRight', 1000);
        }
        if(data.name=='clockwise'){
            console.log('Browser asked Ar Drone to rotate clockwise');
            client.clockwise(0.5);
            client.after(1000,function(){                
                console.log('Browser asked Ar Drone to Stay and Hover');
                client.stop();
            })
        }
        if(data.name=='counterClockwise'){
            console.log('Browser asked Ar Drone to rotate counter clockwise');
            client.counterClockwise(0.5);
            client.after(1000,function(){                
                console.log('Browser asked Ar Drone to Stay and Hover');
                client.stop();
            })
        }        
        if(data.name=='calibrate'){
            console.log('Browser asked Ar Drone to calibrate');
            client.calibrate(0);
        }
    });
});
