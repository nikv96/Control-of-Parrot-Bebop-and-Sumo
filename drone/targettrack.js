var PythonShell = require('python-shell');

// Create Exports component
var TargetAnalysis = exports = module.exports = function(pngStream, callback){
    if(typeof callback !== 'function') 
        throw new Error('Callback missing');

    var start = function(interval){
        if(targetInterval) 
            stop();
        interval = interval || 150;
        targetInterval = setInterval(detectTarget, interval);
    }

    var stop = function(){
        if( targetInterval ) 
            clearInterval(targetInterval);
        targetInterval = null;
    }

    var targetAnalysis = function(){
      var options = {
        mode: 'binary'
      };

      var pyshell = new PythonShell('mosse.py');

      pyshell.send(pngStream);

      pyshell.on('message', function (message) {
        console.log(message);
      });

      pyshell.end(function (err) {
        if (err) throw err;
        console.log('finished');
      });
    }

    return {
        'stop':stop,
        'start':start
    }
};
