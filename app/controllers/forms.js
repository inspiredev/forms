var mongoose = require('mongoose'),
	Form = mongoose.model('Form');

exports.showAll = function(req, res) {
	Form.find(function (err, forms) {
		if (err) throw new Error(err);
		res.write(JSON.stringify(forms));
		res.end();
	});
}

exports.show = function(req, res) {
	var form_id = req.params.form_id;
	// @TODO make sure form_id is safe
	// Error: CastError: Cast to ObjectId failed for value "1" at path "_id"
	Form.findById(form_id, function(err, form) {
		if (err) throw new Error(err);
		res.write(JSON.stringify(form));
		res.end();
	})
}