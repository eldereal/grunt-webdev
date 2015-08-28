var url = require("url");
var path = require("path");

module.exports = function(grunt, opt){    
    if(opt) opt = opt.options;
    return {
        name: "oss",
        createConfig: function(context, block){
            var targetName = block.dest;
            if(!context.last){
                throw new Error("'oss' task muse be the last step of usemin flow");
            }
            if(context.inFiles.length!=1){
                grunt.log.writeln("context: "+ JSON.stringify(context, null, "    "));
                throw new Error("'oss' task handles exactly one file. You should consider compacting the files into one by 'concat'");
            }
            var version_hash = grunt.config("versionhash");
            if(!version_hash){
                throw new Error("'versionhash' task bust be run before 'oss' step");
            }
            var files = [];
            context.inFiles.forEach(function(p) {
                files.push(path.join(context.inDir, p));
            });
            
            var generated = context.options[targetName];
            if(!generated){
                generated = context.options[targetName] = {
                    options:{
                        accessKeyId: opt.accessKeyId,
                        accessKeySecret: opt.accessKeySecret,
                        bucket: opt.bucket,
                        objectGen: function(dest){
                            if(dest.indexOf("/") == 0){
                                return dest.substring(1);
                            }else{
                                return dest;
                            }
                        }
                    },
                    files:{}
                }
            }

            if(opt){
            	for(var k in opt){
            		generated.options[k] = opt[k];
            	}
            }

            
            var uploadFile = path.join(version_hash, block.dest);

            generated.files[uploadFile] = files;

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

            grunt.task.run("copy:"+block.dest);

            grunt.task.run("useminAddFile:" + block.dest +":"+path.join(context.outDir, block.dest));            

            grunt.task.run("ossAddFile:" + block.dest +":"+url.resolve(opt.url, uploadFile).replace(/:/g, "%3A"));

            //grunt.task.run("oss:"+targetName);                
            return true;
        }
    }
}