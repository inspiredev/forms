var forms = require('../app/controllers/forms');

module.exports = function (app) {
	app.get('/', function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		res.write('<h1>Inspired Forms</h1><div>Welcome to Inspired Forms.</div>');
		res.end();
	});

	app.get('/forms', forms.showAll);
	app.get('/forms/:form_id', forms.show);
}