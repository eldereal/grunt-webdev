var path = require("path");
var fs = require("fs");

module.exports = function(grunt) {
	grunt.registerMultiTask("app", "fix useminPrepare config to build an app", function(){
		var target = this.target;
		var app = this.data;
		var opt = this.options();

        var watch = grunt.config("watch");
        if(!watch) watch = {};
        if(!watch.app) watch.app = { files:[] };
        watch.app.files.push(app.src);
        grunt.config("watch", watch);

		var useminPrepare = grunt.config("useminPrepare");
		if(!useminPrepare) useminPrepare = {};		

		useminPrepare.html = app.src;

        var appconf = grunt.config("app");
        if(!appconf.options){
            appconf.options = {};
        }
        appconf.options.currentApp = app;
        grunt.config("app", appconf);

		grunt.config("useminPrepare", useminPrepare);

		var usemin = grunt.config("usemin");
		if(!usemin) usemin = {
			options: {                
                blockReplacements: {
                    css: function (block) {
                    	var ossRevMap = grunt.config("ossFileRev") || {};
                        if(ossRevMap[block.dest]){
                            block.dest = ossRevMap[block.dest];
                        }
                        var r = '<link rel="stylesheet" href="' + block.dest + '"';                
                        if(block.media){
                            r += ' media="'+block.media+'"';
                        }
                        return r + '/>';                        
                    },
                    compass: function (block) {
                    	var ossRevMap = grunt.config("ossFileRev") || {};
                        if(ossRevMap[block.dest]){
                            block.dest = ossRevMap[block.dest];
                        }
                        var r = '<link rel="stylesheet" href="' + block.dest + '"';                
                        if(block.media){
                            r += ' media="'+block.media+'"';
                        }
                        return r + '/>';                        
                    },
                    js: function (block) {
                    	var ossRevMap = grunt.config("ossFileRev") || {};
                        if(ossRevMap[block.dest]){
                            block.dest = ossRevMap[block.dest];
                        }
                        var r = '<script type="text/javascript" src="' + block.dest + '"';
                        if(block.defer){
                            r += ' defer="'+block.defer+'"';
                        }
                        if(block.async){
                            r += ' async="'+block.async+'"';
                        }
                        return r + '></script>';
                    },
                    coffee: function (block) {
                        var ossRevMap = grunt.config("ossFileRev") || {};
                        if(ossRevMap[block.dest]){
                            block.dest = ossRevMap[block.dest];
                        }
                        var r = '<script type="text/javascript" src="' + block.dest + '"';
                        if(block.defer){
                            r += ' defer="'+block.defer+'"';
                        }
                        if(block.async){
                            r += ' async="'+block.async+'"';
                        }
                        return r + '></script>';
                    },
                    ngtemplate: function (block) {
                    	var ossRevMap = grunt.config("ossFileRev") || {};
                        if(ossRevMap[block.dest]){
                            block.dest = ossRevMap[block.dest];
                        }
                        var r = '<script type="text/javascript" src="' + block.dest + '"';
                        if(block.defer){
                            r += ' defer="'+block.defer+'"';
                        }
                        if(block.async){
                            r += ' async="'+block.async+'"';
                        }
                        return r + '></script>';
                    },
                    include: function(block){
                        var map = grunt.config("usemin-include");
                        // console.info(block);
                        // console.info(map);
                        var res = "";
                        for (var i = 0; i < block.src.length; i++) {
                            var name = block.src[i];
                            var path = map[name];
                            if (path) {
                                var content = fs.readFileSync(path, {encoding: null});
                                res += content;
                            }
                        };
                        return res;
                    }
                }
            }
		};
		usemin.html = path.join("build/html", app.src);
		grunt.config("usemin", usemin);

		var copy = grunt.config("copy");
		if(!copy) copy = {};
		if(!copy.app) copy.app = {};
		copy.app.files = [{
            src: app.src,
            dest: path.join("build/html", app.src),
            nonull: true
        }];
        grunt.config("copy", copy);

        if(app.test && app.test.unit){
            var karma = grunt.config("karma");
            if(!karma) karma = {};
            if(!karma[app.name]) karma[app.name] = {};
            if(!karma[app.name].options) karma[app.name].options = {};
            if(!karma[app.name].options.files) karma[app.name].options.files = [];
            karma[app.name].options.files.push(app.test.unit+"/**/*.js");
            grunt.config("karma", karma);
        }

		grunt.task.run("cleanFileRev", "useminPrepare", "copy:app", "usemin", "appdeploy:"+target, "ossupload");
	});

    grunt.registerTask("appdeploy", function(appName){
        
        var app = grunt.config("app")[appName];
        var opt = grunt.config("app").options;

        var files = grunt.config("useminFileRev");
        var copy = grunt.config("copy");        

        if(!copy.appdeploy) copy.appdeploy = {};
        copy.appdeploy.files = [{
            src:  path.join("build/html", app.src),
            dest: app.dest,
            nonull: true,
        }];
        for(var dest in files){
            var src = files[dest];
            copy.appdeploy.files.push({                
                src: src,
                dest: path.join(opt.resourcePath, dest),
                nonull: true,
            });
        }
        if(app.copy){
            if(Array.isArray(app.copy)){
                copy.appdeploy.files = copy.appdeploy.files.concat(app.copy);
            }else{
                copy.appdeploy.files.push(app.copy);
            }
        }
        grunt.config("copy", copy);
        grunt.task.run("copy:appdeploy");
    });
};