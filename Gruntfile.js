'use strict';

module.exports = function(grunt) {

	// load all grunt tasks
	require('load-grunt-tasks')(grunt);
	// display execution time of grunt tasks
	require('time-grunt')(grunt);

	grunt.initConfig({
		config: require('./config/config'),
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		nodemon: {
			dev: {
			}
		},
		sass: {
			dev: {
				files: {
					'public/css/main.css': 'sass/main.scss'
				}
			}
		},
		autoprefixer: {
			dev: {
				src: 'public/css/main.css',
				dest: 'public/css/main.css'
			}
		},
		csso: {
			options: {
				report: 'gzip'
			},
			prod: {
				files: {
					'public/css/main.css': [
						'public/components/normalize-css/normalize.css',
						'public/components/bootstrap/dist/css/bootstrap.css',
						'public/css/main.css'
					]
				}
			}
		},
		watch: {
			css: {
				files: ['sass/**/*.scss'],
				tasks: ['css']
			}
		}
	});

	grunt.registerTask('css', [
		'sass',
		'autoprefixer',
		'csso'
	]);

	grunt.registerTask('dev', [
		'css',
		'concurrent:dev'
	]);

	grunt.registerTask('default', ['dev']);
}