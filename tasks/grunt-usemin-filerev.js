module.exports = function(grunt){
	grunt.registerTask("cleanFileRev", function(){
		grunt.config("useminFileRev", {});
		grunt.config("ossFileRev", {});
    });

    grunt.registerTask("useminAddFile", function(src, dest){
    	if(!src || !dest){
    		throw new Error("'useminAddFile' task must have 2 parameters");
    	}
    	var rev = grunt.config("useminFileRev");
    	rev[src] = dest;
    	grunt.config("useminFileRev", rev);
    });

    grunt.registerTask("ossAddFile", function(src, dest){
    	if(!src || !dest){
    		throw new Error("'ossAddFile' task must have 2 parameters");
    	}
    	var rev = grunt.config("ossFileRev");
    	rev[src] = dest.replace(/%3A/gi, ":");
    	grunt.config("ossFileRev", rev);
    });
}