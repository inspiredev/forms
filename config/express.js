var express = require('express'),
	exphbs = require('express3-handlebars');

module.exports = function(app, config) {
	app.configure(function () {
		app.use(express.compress());
		app.set('port', config.port);
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(app.router);
		app.engine('.hbs', exphbs({
			extname: '.hbs',
			layoutsDir: config.root + '/app/views/layouts',
			defaultLayout: 'main'
		}));
		app.set('views', config.root + '/app/views');
		app.set('view engine', '.hbs');
		app.use(function(req, res) {
			res.status(404).render('404', { title: '404' });
		});
		app.use(express.static(config.root + '/public'));
	});
}