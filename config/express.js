'use strict';

var express = require('express');
var compression = require('compression');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

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

	app.use(compression());
	app.set('port', config.port);
	app.use(morgan(config.logFormat));
	app.use(bodyParser.json());
	app.use(app.router);
	app.engine('.hbs', hbs.engine);
	app.set('views', config.root + '/app/views');
	app.set('view engine', '.hbs');
	app.use(serveStatic(config.root + '/public'));
	app.use(function (req, res) {
		res.status(404).render('404', { title: '404' });
	});
	app.all('*', function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});
};
