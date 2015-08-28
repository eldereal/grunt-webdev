module.exports = function(grunt){
	grunt.registerTask("echo", function(conf){
		grunt.log.writeln(JSON.stringify(grunt.config(conf), null, "  "));
    });
};