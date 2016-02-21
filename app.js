'use strict';

require('dotenv').config();
var express = require('express');
var compression = require('compression');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var forms = require('./app/controllers/forms');

var app = express();

// express configuration
// hbs engine
var hbs = exphbs.create({
	extname: '.hbs',
	layoutsDir: __dirname + '/app/views/layouts',
	defaultLayout: 'main',
	helpers: {
		debug: console.log,
		json: function (stuff) {
			return JSON.stringify(stuff, undefined, 2);
		}
	}
});

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
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

app.use(serveStatic('public'));
// routes
app.get('/', forms.showAll);
app.get('/:form_id', forms.show);
app.post('/', forms.create);
app.post('/:form_id', forms.newEntry);
app.put('/:form_id', forms.update);

app.use(function (req, res) {
	res.status(404).render('404', { title: '404' });
});

app.listen(3000, function () {
	console.log('Express server is listening on port 3000 in %s mode', app.settings.env);
});
