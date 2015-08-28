var path = require("path");

module.exports = function(grunt){    
	grunt.registerTask("proxy", function(target){
		var conf = grunt.config("proxy");
        var app = conf && conf[target];
        if(!app){
            grunt.log.writeln("Cannot find proxy config, skip task");
            return;
        }

		var bgShell = grunt.config("bgShell");
		if(!bgShell) bgShell = {};
		if(!bgShell._defaults) bgShell._defaults = {
            execOpts: {},
            stdout: true,
            stderr: true,
            bg: true,
            fail: true,
            done: function(err, stdout, stderr) {}
        };
        var args = app.port + " " + app.defaultRoute;
        for(var k in app.routes){
            args+= " " + k +"::"+app.routes[k];
        }
        var exec = path.resolve(__dirname, "..", "proxy", "proxy.js");
        bgShell["proxy_"+target] = {
        	cmd: "node " + exec + " " + args
        };
        grunt.config("bgShell", bgShell);
        grunt.task.run("bgShell:proxy_"+target);        
    });
};