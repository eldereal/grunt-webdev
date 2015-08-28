var path = require("path");

module.exports = function(grunt, options) {    
    if(options) options = options.options;
    return {
        name: 'usemin-include',
        createConfig: function(context, block){
            
            var paths = context.options;
            context.inFiles.forEach(function(p) {
                var f = path.join(context.inDir, p);
                paths[p] = f;               
            });
            
            context.options = paths;

            context.outDir = context.inDir;
            context.outFiles = context.inFiles;
            return true;
        }
    };        
};