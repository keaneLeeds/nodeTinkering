process.argv.forEach(function(val, index, array) {
	console.log(index + ': ' + val);
    });

var util = require('util');

process.nextTick(function() {
	console.log('nextTick callback');
    });

console.log(util.inspect(process.memoryUsage()));

console.log(process.uptime());