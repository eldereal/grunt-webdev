var path = require("path");

module.exports = function(grunt, opt){
    if(opt) opt = opt.options;
    return {
        name: 'ngtemplates',
        createConfig: function(context, block){     
            var targetName = block.dest;           
            var apps = block.raw.map(function(line){
                var m = /ng\-app=(['"]?)(.*?)\1/i.exec(line);
                if(m) return m[2];
            });
            var app = null;
            for(var i in apps){
                if(!app){
                    app = apps[i];
                }else if(apps[i] && apps[i]!=app){
                    throw new Error("ng-app attribute in same <!-- build --> tag must be same.");
                }
            }
            if(!app) throw new Error("ngtemplate builder need at least one ng-app attribute.");
            
            var generated = context.options[targetName];
            if(!generated){
                generated = context.options[targetName] = {};
            }                                
            generated.options = {
                module: app,
                htmlmin: {
                    collapseBooleanAttributes: false,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false,
                    removeComments: true, // Only if you don't use comment directives!
                    removeEmptyAttributes: false,
                    removeRedundantAttributes: false,
                    removeScriptTypeAttributes: false,
                    removeStyleLinkTypeAttributes: false
                }
            };
            if(opt){
                var k;
                if(opt.htmlmin){
                    for(k in opt.htmlmin){
                        generated.options.htmlmin[k] = opt.htmlmin[k];
                    }
                }
                for(k in opt){
                    if(k=='htmlmin')continue;
                    generated.options[k] = opt[k];
                }
            }
            generated.cwd = context.inDir;
            generated.src = context.inFiles;
            generated.dest = path.join(context.outDir, block.dest);

            context.outFiles = [block.dest];

            if(context.last){
                grunt.task.run("useminAddFile:" + block.dest +":"+path.join(context.outDir, block.dest));
            }
            
            grunt.task.run("ngtemplates:"+targetName);                
            return true;               
        }
    };
};