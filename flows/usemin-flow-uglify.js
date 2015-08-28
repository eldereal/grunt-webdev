var path = require("path");

module.exports = function(grunt, opt){
    if(opt) opt = opt.options;

    return {
        name: "uglify",
        createConfig: function(context, block, target){
            var targetName = block.dest;

            var files = [];
            context.inFiles.forEach(function(p) {
                files.push(path.join(context.inDir, p));
            });

            var compress=true;
            block.raw.forEach(function(r){
                if(/<script .*no-compress.*>/.test(r)){
                    compress = false;
                }
            });

            var nopt = { sourceMap: true };
            for(var k in opt){
                nopt[k] = opt[k];
            }

            if(!compress){
                nopt.mangle = false;
            }
            
            var generated = context.options[targetName] = {
                files: {},                        
                options: nopt
            };
            generated.files[path.join(context.outDir, block.dest)] = files;
            context.outFiles = [block.dest];

            if(context.last){
                grunt.task.run("useminAddFile:" + block.dest +":"+path.join(context.outDir, block.dest));
            }

            grunt.task.run("uglify:"+targetName);                
            return true;
        }
    };
};