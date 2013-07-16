var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	mongo = require('mongodb'),
	MongoClient = mongo.MongoClient,
	_ = require('underscore');

// express configuration
app.use(express.logger('dev'));
app.use(express.bodyParser());

var mongoURI = (process.env.MONGOLAB_URI) ? process.env.MONGOLAB_URI : "mongodb://localhost:27017/forms";

// Create a counter collection
MongoClient.connect(mongoURI, function(err, db) {
	db.createCollection('counters', function(err, collection){
		if (err) {
			console.dir(err);
		}
	});
});

// Allow CORS - see http://enable-cors.org/server_expressjs.html
app.all('/forms/:form_id', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/forms/:form_id', function(req, res) {
	var id = req.params.form_id,
		json;
	MongoClient.connect(mongoURI, function(err, db) {
		if (err) {
			return (console.dir(err));
		}

		var collection = db.collection(id);

		collection.find().toArray(function(err, results) {
			res.write(JSON.stringify(results));
			res.end();
			db.close();
		});
	});


});

app.post('/forms/:form_id', function(req, res) {
	var form_id = req.params.form_id,
		entry = {};
	console.log(req.body);
	_.each(req.body, function(value, key) {
		entry[key] = value;
	});
	console.log(entry);

	MongoClient.connect(mongoURI, function(err, db) {
		if(err) {
			return console.dir(err);
		}
		// Create the form collection if it doesn't exist, or ignore otherwise
		db.createCollection(form_id, function(err, collection) {

			if (err) {
				console.log(err);
				res.writeHead(500);
				res.end();
				db.close();
			}

			// get next sequence, and then insert the entry into the collection
			// a bit of a callback soup
			db.collection('counters').findAndModify(
				// query
				{
					'_id': form_id
				},
				// sort
				[[ '_id', 'asc' ]],
				// update
				{
					$inc: {seq: 1}
				},
				// options
				{
					upsert: true,
					new: true
				},
				// callback
				function(err, object) {
					if (err) {
						console.dir(err);
					}
					// now insert entry
					entry.sid = object.seq;
					collection.insert(entry, {w:1}, function(err, results) {
						if (err) {
							console.dir(err);
						} else {
							console.log('Successfully created new entry for form ' + form_id);
							res.writeHead(200);
							res.end();
							db.close();
						}
					});
				}
			);
		});
	});


});

server.listen(process.env.PORT || 3000);
console.log( "Express server is listening on port %d in %s mode", server.address().port, app.settings.env);