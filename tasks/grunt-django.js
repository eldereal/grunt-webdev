module.exports = function(grunt){
	grunt.registerTask("django", function(target){

        var conf = grunt.config("django");
		var app = conf && conf[target];
		if(!app){
            grunt.log.writeln("Cannot find django config, skip task");
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
        bgShell["django_"+target] = {
        	cmd: "python "+app.manager+" runserver "+app.port
        };
        grunt.config("bgShell", bgShell);
        grunt.task.run("bgShell:django_"+target);        
    });
};