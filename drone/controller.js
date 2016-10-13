var io = require('socket.io')(3002);
//io.set('log level', 1);

io.on('connection', function (socket) {
    var drone = require('ar-drone');
    console.log('drone required');
    var client = drone.createClient();
    console.log('Connected');
    client.config('control:altitude_max', '20000');

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
            currentState = 'facetrack';
            console.log('Switching to Face Track mode');
            socket.emit('/copterface',{name:'cmd', value:'toggle'});
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
            var speed=Math.abs(data.value*1.42);            
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
            var speed=Math.abs(data.value*1.42);            
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
            var speed=Math.abs(data.value*1.66);            
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
            var speed=Math.abs(data.value*1.66);            
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
