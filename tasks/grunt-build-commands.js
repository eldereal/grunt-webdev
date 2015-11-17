module.exports = function(grunt){
    var defaultConfig = {
        useminConfig: {
            options: {
                watch: {
                    tasks: ['rebuild'],
                    target: 'app',
                    options: {
                        spawn: false
                    }
                },
                compass: {
                    options: { outputStyle: 'expanded' }
                },
                concat: {
                    options: { separator: grunt.util.linefeed+';'+grunt.util.linefeed }
                },
                cssmin: {
                    options: { keepSpecialComments: 0 }
                },
                oss: {
                    options: {
                        accessKeyId: "",
                        accessKeySecret: "",
                        bucket: "",
                        url: ""
                    }
                },
                karma: {
                    options: {
                        files: [],
                        runnerPort: 8010,
                        browsers: ['Chrome'],
                        singleRun: true,
                        frameworks: ['jasmine'],
                        reporters: ['progress'],
                        colors: true,
                        logLevel: 'INFO'
                    }
                }
            },
            'dev': {
                compass: ['watch', 'exists', 'transfo-extscss', 'compass', 'transfo-combine'],
                ngtemplate: ['watch', 'exists', 'ngtemplate'],
                js: ['watch', 'exists', 'concat'],
                coffee: ['watch', 'exists', 'coffee'],
                css: ['watch', 'exists', 'transfo-combine'],
                include: ['watch', 'usemin-include']
            },
            'release': {
                compass: ['watch', 'exists', 'transfo-extscss', 'compass', 'transfo-combine', 'cssmin'],
                ngtemplate: ['watch', 'exists', 'ngtemplate', 'uglify'],
                js: ['watch', 'exists', 'uglify'],
                coffee: ['watch', 'exists', 'coffee', 'uglify'],
                css: ['watch', 'exists', 'transfo-combine', 'cssmin'],
                include: ['watch', 'usemin-include']
            },
            'publish': {
                compass: ['watch', 'exists', 'transfo-extscss', 'compass', 'transfo-combine', 'cssmin', 'oss'],
                ngtemplate: ['watch', 'exists', 'ngtemplate', 'uglify', 'oss'],
                js: ['watch', 'exists', 'uglify', 'oss'],
                coffee: ['watch', 'exists', 'coffee', 'uglify', 'oss'],
                css: ['watch', 'exists', 'transfo-combine', 'cssmin', 'oss'],
                include: ['watch', 'usemin-include']
            },
            'test': {
                compass: ['watch', 'exists', 'transfo-extscss', 'compass', 'transfo-combine'],
                ngtemplate: ['watch', 'exists', 'ngtemplate', 'karma'],
                js: ['watch', 'exists', 'jshint', 'karma', 'concat'],
                coffee: ['watch', 'exists', 'coffee', 'karma'],
                css: ['watch', 'exists', 'transfo-combine'],
                include: ['watch', 'usemin-include']
            },
        },
        clean: {
            temps: ['.sass-cache', '.tmp', 'tmp'],
            options: {
                force: true
            }
        },
        watch: {
            empty:{
                files: [],
                tasks: []
            }
        },
        oss: {
            options: {
                objectGen: function(dest){
                    if(dest.indexOf("/") === 0){
                        return dest.substring(1);
                    }else{
                        return dest;
                    }
                }
            }
        },
    };

    function mix(target, source){
        if(target === undefined){
            target = {};
        }
        if(typeof(source)!='object' || typeof(target)!='object'){
            return;
        }
        var names = Object.getOwnPropertyNames(source);
        for(var i in names){
            var k = names[i];
            if(source[k] !== undefined && target[k] === undefined){
                target[k] = source[k];
            }else if(source[k] !== undefined && target[k] !== undefined){
                mix(target[k], source[k]);
            }
        }
        return target;
    }

    grunt.registerTask('updateDefaultConfig', function(conf){
        if(!conf){
            for(var k in defaultConfig){
                grunt.task.run("updateDefaultConfig:"+k);
            }
        }else{
            var source = defaultConfig[conf];
            var dest = grunt.config(conf);
            dest = mix(dest, source);
            grunt.config(conf, dest);
        }
    });

	grunt.registerTask('devBuild', function(app){
        if(!app){
            grunt.registerTask('rebuild', ['app']);
        }else{
            grunt.registerTask('rebuild', ['app:'+app]);
        }
        grunt.task.run('updateDefaultConfig', 'useminConfig:dev', 'rebuild');
    });

    grunt.registerTask('dev', function(app){
        var t = "devBuild";
        if(app) t += ":" + app;
        grunt.task.run(t, 'watch:app');
    });

    grunt.registerTask("fixKarmaConfig", function(){
    	var karma = grunt.config("karma");
    	for(var k in karma){
    		if(!karma[k] || !karma[k].options || !karma[k].options.files || karma[k].options.files.length === 0){
    			delete karma[k];
    		}
    	}
    	grunt.config("karma", karma);
    });

    grunt.registerTask('testBuild', function(app){
        if(!app){
            grunt.registerTask('rebuild', ['app', 'fixKarmaConfig', 'karma']);
        }else{
            grunt.registerTask('rebuild', ['app:'+app, 'fixKarmaConfig', 'karma']);
        }
        grunt.task.run('updateDefaultConfig', 'useminConfig:test', 'rebuild');
    });

     grunt.registerTask('test', function(app){
        var t = "testBuild";
        if(app) t += ":" + app;
        grunt.task.run(t, 'watch:app');
    });

    grunt.registerTask('releaseBuild', function(app){
        if(!app){
            grunt.registerTask('rebuild', ['app']);
        }else{
            grunt.registerTask('rebuild', ['app:'+app]);
        }
        grunt.task.run('updateDefaultConfig', 'useminConfig:release', 'rebuild');
    });

    grunt.registerTask('release', function(app){
        var t = "releaseBuild";
        if(app) t += ":" + app;
        grunt.task.run(t, 'watch:app');
    });



    grunt.registerTask("publish", function(app){
        if(!app){
            grunt.registerTask('rebuild', ['app']);
            grunt.task.run('versionhash', 'updateDefaultConfig', 'useminConfig:publish', 'rebuild');
        }else{
            grunt.registerTask('rebuild', ['app:'+app]);
            grunt.task.run('versionhash', 'updateDefaultConfig', 'useminConfig:publish', 'rebuild');
        }
    });

    grunt.registerTask('upload', 'oss');
};
