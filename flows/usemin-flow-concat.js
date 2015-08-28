var path = require("path");

module.exports = function(grunt, opt){
    if(opt) opt = opt.options;
    return {
        name: "concat",
        createConfig: function(context, block){
            var targetName = block.dest;

            var files = [];
            context.inFiles.forEach(function(p) {
                files.push(path.join(context.inDir, p));
            });
            
            var generated = context.options[targetName] = {
                files: [{
                    src: files,
                    dest: path.join(context.outDir, block.dest),
                    nonull: true
                }],
                options: opt
            };
            context.outFiles = [block.dest];

            if(context.last){
                grunt.task.run("useminAddFile:" + block.dest +":"+path.join(context.outDir, block.dest));
            }

            grunt.task.run("concat:"+targetName);                
            return true;
        }
    };
};