var path = require("path");
var fs = require("fs");
var crypto = require("crypto");
var transfoUnifyurl = require('transfo-unifyurl');

function createTransfoUnifyUrlConfig(opt, base){
    if(!base) base = {};
    if(!base.transforms) base.transforms = [];
    for(var pname in opt){
        base.transforms.push(transfoUnifyurl(pname));
    }
    base.unifyurl = opt;
    return base;
}

module.exports = function(grunt, opt){
    if(opt) opt = opt.options;
    return {
        name:'transfo',
        createConfig: function(context, block) {
            var targetName = block.dest + "-scss";
            var exts = [];
            context.inFiles.forEach(function(p) {
                var ext = path.extname(p);
                if(exts.indexOf(ext)<0){
                    exts.push(ext);
                }
            });
            var options = createTransfoUnifyUrlConfig({
                "url": {
                    dest: 'assets',
                    url: '../../../transfo/assets',
                    extensions: exts,
                },
                "import": {
                    dest: '.',
                    url: '.',
                    extensions: ['.scss'],
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

            var generated = context.options[targetName] = {
                files: [],
                options: options
            };

            context.outFiles =[];
            context.inFiles.forEach(function(p) {
                var file = path.join(context.inDir, p);
                var content = fs.readFileSync(file);
                var md5 = crypto.createHash('md5').update(content).digest("hex");
                var out = md5 + ".scss";
                generated.files.push({
                    src: file,
                    dest: path.join(context.outDir, out),
                    nonull: true
                });
                context.outFiles.push(out);
            });

            grunt.task.run("transfo:"+targetName);
            return true;
        }
    };
};
