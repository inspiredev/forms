'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	Form = mongoose.model('Form'),
	Entry = mongoose.model('Entry'),
	mailer = require('../utils/mailer');

// Check for valid ID
function isValidObjectID(str) {
	var len = str.length;
	if (len === 12 || len === 24) {
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
};

exports.show = function (req, res) {
	var form_id = req.params.form_id;
	if (!isValidObjectID(form_id)) {
		res.status(400).send('Form ID entered is invalid');
		return;
	}
	Form.findById(form_id, function (err, form) {
		if (err) {
			res.status(400).send(err);
		} else {
			// show latest entry first
			form.entries.reverse();
			res.render('form_single', form);
		}
	});
};

exports.create = function (req, res) {
	console.log('creating new form');
	var form = new Form({
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifySubject: req.body['notify-subject'] || 'New form submission',
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name']
	});
	form.save(function (err, form) {
		if (err) {
			console.log(err);
		} else {
			res.status(200).json(form);
		}
	});
};

exports.update = function (req, res) {
	var form = {
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifySubject: req.body['notify-subject'],
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name']
	};
	Form.findByIdAndUpdate(req.params.form_id, form, function (err, form) {
		if (err) {
			console.error(err);
		} else {
			res.status(200).json(form);
		}
	});
};

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
			res.sendStatus(200);
			// send email notification
			mailer.send(mailer.parse(content), {
				from: form.fromName + ' <' + form.fromEmail + '>',
				to: form.notifyEmail,
				subject: form.notifySubject + ' #' + form.entries.length,
				replyTo: content.name + ' <' + content.email + '>'
			});
		} else {
			res.send(400, err);
		}
	});
};
