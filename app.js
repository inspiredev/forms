'use strict';

require('dotenv').config();
var express = require('express');
var compression = require('compression');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var path = require('path');

var forms = require('./app/controllers/forms');

var app = express();

// express configuration
// hbs engine
var hbs = exphbs.create({
	extname: '.hbs',
	layoutsDir: path.join(__dirname, '/app/views/layouts'),
	defaultLayout: 'main',
	helpers: {
		debug: console.log,
		json: function (stuff) {
			return JSON.stringify(stuff, undefined, 2);
		},
		eq: function (a, b, options) {
			if (a === b) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		}
	}
});

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
	skip: function (req, res) {
		// skip for non-error responses in production
		if (process.env.NODE_ENV === 'production') {
			return res.statusCode < 400;
		}
	}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('.hbs', hbs.engine);
app.set('views', 'app/views');
app.set('view engine', '.hbs');
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.use('/forms', serveStatic('public'));
// routes
app.get('/forms', forms.showAll);
app.get('/forms/:form_id', forms.show);
app.post('/forms', forms.create);
app.post('/forms/:form_id', forms.newEntry);
app.put('/forms/:form_id', forms.update);

app.use(function (req, res) {
	res.status(404).render('404', { title: '404' });
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Express server is listening on port 3000 in %s mode', app.settings.env);
});
