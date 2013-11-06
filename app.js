var express = require('express'),
	http = require('http'),
	server = http.createServer(app),
	mongo = require('mongodb'),
	MongoClient = mongo.MongoClient,
	_ = require('underscore'),
	mailer = require('./mailer'),
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



// var mongoURI = (process.env.MONGOLAB_URI) ? process.env.MONGOLAB_URI : "mongodb://localhost:27017/forms";

// // Create a counter collection
// MongoClient.connect(mongoURI, function(err, db) {
// 	db.createCollection('counters', function(err, collection){
// 		if (err) {
// 			console.dir(err);
// 		}
// 	});
// });

// // Allow CORS - see http://enable-cors.org/server_expressjs.html
// app.all('/forms/:form_id', function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	next();
// });

// app.get('/forms/:form_id', function(req, res) {
// 	var id = req.params.form_id,
// 		json;

// 	MongoClient.connect(mongoURI, function(err, db) {
// 		if (err) {
// 			return (console.dir(err));
// 		}

// 		var collection = db.collection(id);

// 		collection.find().toArray(function(err, results) {
// 			res.write(JSON.stringify(results));
// 			res.end();
// 			db.close();
// 		});
// 	});
// });

// // Default response
// app.get('/', function(req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
// 	res.write('<h1>Inspired Forms</h1><div>Welcome to Inspired Forms.</div>');
// 	res.end();
// });

// app.post('/forms/:form_id', function(req, res) {
// 	var form_id = req.params.form_id,
// 		entry = {};

// 	entry = req.body;

// 	MongoClient.connect(mongoURI, function(err, db) {
// 		if(err) {
// 			console.dir(err);
// 			return ;
// 		}
// 		// Create the form collection if it doesn't exist, or ignore otherwise
// 		db.createCollection(form_id, function(err, collection) {

// 			if (err) {
// 				console.log(err);
// 				res.writeHead(500);
// 				res.end();
// 				db.close();
// 			}

// 			// get next sequence, and then insert the entry into the collection
// 			// a bit of a callback soup
// 			db.collection('counters').findAndModify(
// 				// query
// 				{
// 					'_id': form_id
// 				},
// 				// sort
// 				[[ '_id', 'asc' ]],
// 				// update
// 				{
// 					$inc: {seq: 1}
// 				},
// 				// options
// 				{
// 					upsert: true,
// 					new: true
// 				},
// 				// callback
// 				function(err, object) {
// 					if (err) {
// 						console.dir(err);
// 					}
// 					// now insert entry
// 					entry.sid = object.seq;
// 					collection.insert(entry, {w:1}, function(err, results) {
// 						if (err) {
// 							console.dir(err);
// 						} else {
// 							console.log('Successfully created new entry for form ' + form_id);
// 							var content = mailer.parse(results[0]);
// 							res.writeHead(200, {
// 								'Content-Type': 'application/json; charset=utf-8',
// 								'Access-Control-Allow-Origin': '*'
// 							});
// 							res.write(JSON.stringify(results[0]));
// 							res.end();
// 							mailer.sendmail(content);
// 							db.close();
// 						}
// 					});
// 				}
// 			);
// 		});
// 	});

// });

app.listen(config.port);
console.log( "Express server is listening on port %d in %s mode", app.settings.port, app.settings.env);