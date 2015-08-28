var path = require("path");

function createTransfoUnifyUrlConfig(opt, base){        
    if(!base) base = {};
    if(!base.transforms) base.transforms = [];
    base.transforms.push(require('transfo-unifyurl'));
    base.unifyurl = opt;
    return base;
}

module.exports = function(grunt, opt){
    if(opt) opt = opt.options;
    return {
        name:'transfo',
        createConfig: function(context, block) {
            var files = [];
            context.inFiles.forEach(function(p) {
                files.push(path.join(context.inDir, p));
            });

            var options = createTransfoUnifyUrlConfig({
                dest: '../assets', 
                url: '../assets', 
                extensions: ['.css'],
                callback: function(from, to, toUrl){
                    var output = path.join(path.dirname(path.join(context.outDir, block.dest)), toUrl);
                    var f = path.relative(context.outDir, output);
                    grunt.task.run("useminAddFile:" + f+":"+to);
                }
            });
            if(opt){
            	if(opt.transforms){
            		options.transforms = options.transforms.concat(opt.transforms);
            	}
            	for(var k in opt){
            		if(k=='transforms')continue;
            		options[k] = opt[k];
            	}
            }
            
            var targetName = block.dest + "-combine";
            var generated = context.options[targetName] = {
                files: [{
                    src: files,
                    dest: path.join(context.outDir, block.dest),
                    nonull: true
                }],
                options: options
            };               
            
            context.outFiles = [block.dest];

            if(context.last){
                grunt.task.run("useminAddFile:" + block.dest +":"+path.join(context.outDir, block.dest));
            }

            grunt.task.run("transfo:"+targetName);                       
            return true;
        }
    };        
};
