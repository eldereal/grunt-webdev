var path = require("path");
var fs = require("fs");

module.exports = function(grunt) {
	grunt.registerMultiTask("exists", "validate files to exist", function(){
		var target = this.target;
		var app = this.data;
		var opt = this.options();

        var files = app.files.src;
        for(var i in files){
            if(!fs.existsSync(files[i])){
                throw new Error("File "+files[i]+" doesn't exist.");
            }
        }
	});    
};