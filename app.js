var express = require('express'),
	http = require('http'),
	server = http.createServer(app),
	mongo = require('mongodb'),
	MongoClient = mongo.MongoClient,
	_ = require('underscore'),
	mongoose = require('mongoose'),
	config = require('./config/config');

// Mongo
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + config.db);
});
// models
require('./app/models/forms');

var app = express();

// express configuration
require('./config/express')(app, config);
require('./config/routes')(app);

app.listen(config.port);
console.log( "Express server is listening on port %d in %s mode", app.settings.port, app.settings.env);