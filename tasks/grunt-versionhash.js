var exec = require('child_process').exec;

module.exports = function(grunt){
    grunt.registerTask("versionhash", function(){
        var version_hash = grunt.config("versionhash");
        if(version_hash){
            grunt.log.writeln("Version is set: " + version_hash);
        }else{
            var done = this.async();
            exec('git rev-parse HEAD', function(err, out){
                if(err){
                    done(false);
                }else{
                    var version_hash = out.substring(0,7);
                    grunt.log.writeln("Version: " + version_hash);
                    grunt.config("versionhash", version_hash);
                    done(true);
                }
            });
        }
    });
};