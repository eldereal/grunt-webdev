var path = require("path");

module.exports = function(grunt, options) {    
    if(options) options = options.options;
    return {
        name: 'karma',
        createConfig: function(context, block){
            var targetName = grunt.config("app").options.currentApp.name;

            var files = [];
            context.inFiles.forEach(function(p) {
                var f = path.join(context.inDir, p);
                files.push(f);
            });
            
            /*if(context.options.generated){
                delete context.options.generated;
            }*/

            var karma = context.options[targetName];            
            if(!karma) karma = context.options[targetName] = {};
            
            if(!karma.options) karma.options = {};
            if(!karma.options.files) karma.options.files = [];
            if(options){
                if(options.files){
                    for(var i = options.files.length-1;i>=0;i--){
                        var f = options.files[i];
                        if(karma.options.files.indexOf(f)<0){
                            karma.options.files.splice(0, 0, f);
                        }
                    }
                }
                for(var k in options){
                    if(k=="files")continue;
                    karma.options[k] = options[k];
                }
            }

            karma.options.files = karma.options.files.concat(files);            

            if(context.last){
                var copy = grunt.config("copy");
                if(!copy) copy = {};
                copy[block.dest] = {
                    files:[]
                };
                context.inFiles.forEach(function(file){
                    copy[block.dest].files.push({
                        src:  path.join(context.inDir, file),
                        dest: path.join(context.outDir, block.dest),
                        nonull: true,      
                    });
                });
                grunt.config("copy", copy);
                context.outFiles = [block.dest];
                grunt.task.run("copy:"+block.dest);
            }else{
                context.outDir = context.inDir;
                context.outFiles = context.inFiles;
            }

            return true;
        }
    };        
};