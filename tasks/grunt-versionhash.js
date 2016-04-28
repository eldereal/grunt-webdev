var exec = require('child_process').exec;

module.exports = function(grunt){
    grunt.registerTask("versionhash", function(){
        var version_hash = grunt.config("versionhash");
        if(version_hash){
            grunt.log.writeln("Version is set: " + version_hash);
        }else{
            var done = this.async();
            exec('git branch', function(err, out){
                var hash;
                var match;
                if(!err){
                    match = /^\s*\*\s+.*bugfix\-([0-9a-f]{7}).*$/mi.exec(out);
                    if(match){
                        hash = match[1];
                    }
                }
                if(!hash){
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
                }else{
                    grunt.log.writeln("In a bugfix branch, use original version: " + hash);
                    grunt.config("versionhash", hash);
                    done(true);
                }
            });

        }
    });
};
