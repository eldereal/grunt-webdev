/*jshint loopfunc: true */

module.exports = function(grunt) {
	grunt.registerMultiTask("useminConfig", "Init Usemin flow config", function(){
		var target = this.target;
		var conf = this.data;
		var opt = this.options();

		var useminPrepare = grunt.config("useminPrepare");
		if(!useminPrepare) useminPrepare = {};
		if(!useminPrepare.options) useminPrepare.options = { dest: "build", staging: 'tmp' };

		useminPrepare.options.flow = {
			steps: {},
			post: {}
		};

		for(var k in this.data){
			if(k=='options') continue;
			useminPrepare.options.flow.steps[k] = this.data[k].map(function(flowName){
				var stepopt = opt[flowName];
				return require('../flows/usemin-flow-'+flowName+".js")(grunt, stepopt);
			});
		}

		grunt.config("useminPrepare", useminPrepare);

	});
};