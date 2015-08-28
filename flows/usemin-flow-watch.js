var path = require("path");

module.exports = function(grunt, options) {
    if(!options){
        throw new Error("'watch' config must have tasks to run");
    }
    
    var tasks = options.tasks;
    var target = options.target;
    options = options.options;

    if(!tasks){
        throw new Error("'watch' config must have tasks to run");
    }        
    return {
        name: 'watch',
        createConfig: function(context, block){
            var inDir;
            if(block.searchPath && block.searchPath.length > 0){
                inDir = path.relative('.',path.resolve(path.dirname(grunt.task.current.data), block.searchPath[0]));
            }else{
                inDir = context.inDir;
            }
            var files = [];
            context.inFiles.forEach(function(p) {
                files.push(path.join(inDir, p));
            });
            var it = target || block.dest;
            var generated = context.options[it];
            if(!generated){
                generated = context.options[it] = {};
            }

            generated.tasks = tasks;
            if(options) generated.options = options;
            if(!generated.files) generated.files = [];
            files.forEach(function(f){
                if(generated.files.indexOf(f)<0){
                    generated.files.push(f);
                }
            });
            
            context.outDir = inDir;
            context.outFiles = context.inFiles;
            return true;
        }
    };        
};