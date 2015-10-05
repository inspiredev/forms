var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		root: rootPath,
		port: 3000,
		db: 'mongodb://localhost:27017/forms',
		logFormat: 'dev'
	},

	production: {
		root: rootPath,
		port: 3000,
		db: 'mongodb://mongodb:27017/forms',
		logFormat: 'combined'
	}
};

module.exports = config[env];
