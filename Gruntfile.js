'use strict';

module.exports = function(grunt) {

	// load all grunt tasks
	console.log(require('matchdep').filterDev('grunt-*'));
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		concurrent: {
			dev: {
				tasks: ['nodemon'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		nodemon: {
			dev: {

			}
		}

	});

	grunt.registerTask('dev', ['concurrent:dev']);

	grunt.registerTask('default', ['dev']);
}