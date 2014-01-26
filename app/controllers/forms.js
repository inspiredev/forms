var _ = require('lodash'),
	mongoose = require('mongoose'),
	Form = mongoose.model('Form'),
	Entry = mongoose.model('Entry'),
	mailer = require('../utils/mailer');

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
			res.send(400, err);
		} else {
			res.json(form);
		}
	});
}

exports.create = function (req, res) {
	var form = new Form({
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifySubject: req.body['notify-email'] || 'New form submission',
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name']
	});
	form.save(function (err, form) {
		if (err) {
			console.log(err);
		}
		res.json(form);
	});
}

exports.newEntry = function (req, res) {
	var content = _.omit(req.body, 'form_id'),
		form_id = req.body.form_id,
		entry = new Entry({
			form_id: form_id,
			content: content
		});
	Form.findByIdAndUpdate(form_id, {
		$addToSet: {
			entries: entry
		}
	}, {},function(err, form) {
		if (!err){
			res.send(200);
			console.log(form);
			// send email notification
			mailer.send(mailer.parse(content), {
				from: form.fromName + ' <' + form.fromEmail + '>',
				to: form.notifyEmail,
				subject: form.notifySubject,
				replyTo: content.name + ' <' + content.email + '>'
			});
		} else {
			res.send(400, err);
		}
	});
}