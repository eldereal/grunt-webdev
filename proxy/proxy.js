var express = require('express');
var path =require('path');
var proxy = require('express-http-proxy');
var url = require('url');
var clc = require('cli-color');

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;

if(process.argv.length<4){
	console.error("Usage: node port", path.relative('.', process.argv[1]), "defaultLocation", "[url::location]");
	process.exit(1);
}
var port = process.argv[2];
var defaultLocation = process.argv[3];
var extra = [];
var extras = process.argv.slice(4);
for(var i in extras){
	var a = extras[i].split("::");
	if(a.length!=2){
		console.error("Bad proxy", "\""+extras[i]+"\"");
		process.exit(1);
	}
	extra.push({base: a[0], url: a[1]});
}

var config = {location: defaultLocation, extra: extra};
console.info("Start proxy with config");
console.info(config);


function proxyLocation(app, baseUrl, forwardUrl){
	var u = url.parse(forwardUrl);	
	var protocol = u.protocol || "file";
	var p;
	if(protocol=="file"){
		p = express.static(u.path || ".");
	}else{
		p = proxy(u.host, {
			forwardPath: function(req, res) {
				var p = url.parse(req.url).path;
				var r = u.path == "/" ? p : u.path + p;
				console.info("Proxy", warn((baseUrl || "") + req.url),'->', notice(r));
				return r;
				// if(!baseUrl){
				// 	return url.parse(req.url).path;
				// }else{
				// 	var rel = u.path + url.parse(req.url).path;
				// 	return rel;	
				// }
			},
			intercept: function(data, req, res, callback) {
				var redirect = res.getHeader("location");
				if(redirect){
					var nr = redirect.replace(forwardUrl, req.protocol + '://' + req.get('host')+"/");
					res.setHeader("location", nr);
				}
			    callback(null, data);
			},
			limit: '50mb'
		});
	}
	if(baseUrl){
		app.use(baseUrl, p);
	}else{
		app.use(p);
	}
}

var app = express();

for(var k in extra){
	proxyLocation(app, extra[k].base, extra[k].url);
}
proxyLocation(app, null, defaultLocation);
app.listen(port);
