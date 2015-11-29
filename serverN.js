var http = require('http');
var url = require('url');
var fs = require('fs');

var messages = ["testing"];
var clients = [];

http.createServer(function (req, res) {
	//parse url
	var url_parts = url.parse(req.url);
	console.log("url_parts:");
	console.log(url_parts);

	if(url_parts.pathname == '/') {
	    fs.readFile('./index.html', function(err, data) {
		    res.end(data);
	    });
	} else if(url_parts.pathname.substr(0,5) == '/poll') {
		//polling code here
	    var count = url_parts.pathname.replace(new RegExp("[^0-9]*",""),'');
	    console.log("count: " + count);
	    if(messages.length > count) {
			res.end(JSON.stringify( {
				count: messages.length,
		    	append: messages.slice(count).join("\n")+"\n"
		    }));
    	} else {
    		clients.push(res);
		}
	} else if(url_parts.pathname.substr(0,5) == '/msg/') {
		//message receiving
		var msg = unescape(url_parts.pathname.substr(5));
		messages.push(msg);
		while(clients.length > 0) {	
			var client = clients.pop();
			client.end(JSON.stringify( {
				count: messages.length,
				append: msg+"\n"
			}));		
		}
	}
	res.end();
}).listen(8888,'localhost');

console.log('Server running.');
