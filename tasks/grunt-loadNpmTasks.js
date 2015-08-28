var path = require("path");

module.exports = function(grunt){
    var files = grunt.file.expand(path.resolve(__dirname, '..', 'node_modules', 'grunt-*/tasks'));
    files.forEach(grunt.loadTasks);
};