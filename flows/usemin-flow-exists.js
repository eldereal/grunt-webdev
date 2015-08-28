var path = require("path");

module.exports = function(grunt, options) {    
    if(options) options = options.options;
    return {
        name: 'exists',
        createConfig: function(context, block){
            var targetName = block.dest;

            var files = [];
            context.inFiles.forEach(function(p) {
                var f = path.join(context.inDir, p);
                files.push(f);                
            });
            
            var generated = context.options[targetName] = {
                files: { src: files },                        
                options: options
            };

            context.outDir = context.inDir;
            context.outFiles = context.inFiles;

            grunt.task.run("exists:"+targetName);
            return true;
        }
    };        
};