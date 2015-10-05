var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		root: rootPath,
		port: 3000,
		db: 'mongodb://mongodb:27017/forms'
	},

	production: {
		root: rootPath,
		port: process.env.PORT,
		db: process.env.MONGOLAB_URI
	}
};

module.exports = config[env];
