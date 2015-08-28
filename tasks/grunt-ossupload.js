var path = require("path");

module.exports = function(grunt){
	grunt.registerTask("ossupload", function(){
		var oss = grunt.config("oss");
		var files = grunt.config("useminFileRev");
		var ossconfig = grunt.config("ossconfig");
		var version_hash = grunt.config("versionhash");
		if(!version_hash){
			grunt.log.writeln("No 'versionhash' found, skip 'ossupload'");
			return;			
		}
		if(!ossconfig){
			throw new Error("'ossupload' task need config 'ossconfig' to work");
		}

		function objectGen(dest){
			if(dest.indexOf("/") === 0){
                return dest.substring(1);
            }else{
                return dest;
            }
		}

		for(var file in files){
			if(oss[file]) continue;
			var uploadFile = path.join(version_hash, file);
			var conf = {
				options:{
					accessKeyId: ossconfig.accessKeyId,
	            	accessKeySecret: ossconfig.accessKeySecret,
	            	bucket: ossconfig.bucket,
	            	objectGen: objectGen
            	},
            	files: {}
			};
			conf.files[uploadFile] = [files[file]];
			oss[file] = conf;
		}
		grunt.config("oss", oss);
    });
};