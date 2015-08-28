module.exports = function(grunt){
    grunt.registerTask("version", function(version){
        grunt.config("versionhash", version);
        grunt.log.writeln("Set version: " + version);        
    });
};