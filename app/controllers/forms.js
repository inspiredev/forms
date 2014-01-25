var _ = require('lodash'),
	mongoose = require('mongoose'),
	Form = mongoose.model('Form'),
	Entry = mongoose.model('Entry');

// Check for valid ID
function isValidObjectID(str) {
	var len = str.length;
	if (len == 12 || len == 24) {
		return /^[0-9a-fA-F]+$/.test(str);
	} else {
		return false;
	}
}

exports.showAll = function (req, res) {
	Form.find(function (err, forms) {
		if (err) throw new Error(err);
		// res.write(JSON.stringify(forms));
		// res.end();
		res.render('forms', forms);
	});
}

exports.show = function (req, res) {
	var form_id = req.params.form_id;
	if (!isValidObjectID(form_id)) {
		res.send(400, 'Form ID entered is invalid');
	}
	Form.findById(form_id, function (err, form) {
		if (err) {
			console.error(err);
			res.send(400, err);
		} else {
			res.json(form);
		}
	});
}

exports.create = function (req, res) {
	var name = req.body.name,
		notifyEmail = req.body['notify-email'],
		notifyName = req.body['notify-name'] || 'User',
		notifySubject = req.body['notify-subject'] || 'New form submission';

	var form = new Form({
		name: name,
		notifyName: notifyName,
		notifyEmail: notifyEmail,
		notifySubject: notifySubject
	});
	form.save(function (err, form) {
		if (err) {
			console.log(err);
		}
		res.render('forms', {
			newForm: form
		})
	});
}

exports.newEntry = function (req, res) {
	console.log(req.body);
	var content = req.body,
		form_id = req.body.form_id,
		entry = new Entry({
			form_id: form_id,
			content: _.omit(content, 'form_id')
		});
	Form.findByIdAndUpdate(form_id, {
		$addToSet: {
			entries: entry
		}
	}, {
		upsert: true
	},function(err, form) {
		console.log(form);
		res.send(200, form);
	});
}