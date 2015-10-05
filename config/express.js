'use strict';

var express = require('express'),
	exphbs = require('express3-handlebars');

module.exports = function(app, config) {
	// hbs enging
	var hbs = exphbs.create({
		extname: '.hbs',
		layoutsDir: config.root + '/app/views/layouts',
		defaultLayout: 'main',
		helpers: {
			debug: function(stuff) {
				console.log(stuff);
			}
		}
	});

	app.use(express.compress());
	app.set('port', config.port);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(app.router);
	app.engine('.hbs', hbs.engine);
	app.set('views', config.root + '/app/views');
	app.set('view engine', '.hbs');
	app.use(express.static(config.root + '/public'));
	app.use(function (req, res) {
		res.status(404).render('404', { title: '404' });
	});
	app.all('*', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});
};
