var path = require("path");

module.exports = function(grunt, opt){    
    if(opt) opt = opt.options;
    return {
        name: 'compass',
        createConfig: function(context, block){
            var targetName = block.dest;
            var files = [];
            var outfiles = [];
            context.inFiles.forEach(function(p) {
                files.push(path.join(context.inDir, p));
                outfiles.push(path.join(context.inDir, p).replace(/\.scss$/ig, ".css"));
            });                

            var generated = context.options[targetName];
            if(!generated){
                generated = context.options[targetName] = {};
            }

            var options = {};
            for(var k in opt){
                options[k] = opt[k];
            }
            options.sassDir = process.cwd();
            options.specify = files;
            options.cssDir = path.join(process.cwd(), context.outDir);
            options.relativeAssets = true;

            generated.options = options;

            context.outFiles = outfiles;

            grunt.task.run("compass:"+targetName);                
            return true;
        }
    };
};