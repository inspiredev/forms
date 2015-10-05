'use strict';

var forms = require('../app/controllers/forms');

module.exports = function (app) {
	app.get('/', forms.showAll);
	app.get('/:form_id', forms.show);
	app.post('/', forms.create);
	app.post('/:form_id', forms.newEntry);
	app.put('/:form_id', forms.update);
};
