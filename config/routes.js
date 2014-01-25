var forms = require('../app/controllers/forms');

module.exports = function (app) {
	app.get('/', function(req, res) {
		res.render('home');
	});

	app.get('/forms', forms.showAll);
	app.get('/forms/:form_id', forms.show);
	app.post('/forms', forms.create);
	app.post('/forms/:form_id', forms.newEntry);
}