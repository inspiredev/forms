'use strict';

var _ = require('lodash');
var db = require('../../db');
var mailer = require('../utils/mailer');

exports.showAll = function (req, res) {
	res.render('forms');
};

function getFormEntries (formId, callback) {
	var entries = [];
	db.createReadStream({
		gte: 'entry!' + formId + '!',
		lte: 'entry!' + formId + '!~'
	})
	.on('data', function (entry) {
		// pass back the id, which is the timestamp of the article
		// remove all other database prefixes
		entries = [Object.assign({}, entry.value, {id: entry.key.split('!').pop()})].concat(entries);
	})
	.on('error', function (err) {
		console.error(err);
		callback(err);
	})
	.on('close', function () {
		callback(null, entries);
	});
}

exports.show = function (req, res) {
	var formId = req.params.form_id;
	db.get('form!' + formId, function (err, form) {
		if (err) {
			console.error(err);
			if (err.notFound) {
				res.status(404);
			} else {
				res.status(400);
			}
			return res.send();
		}
		form.requireds = form.validation.requireds.join(',');
		getFormEntries(formId, function (err, entries) {
			if (err) {
				return res.status(400).send(err);
			}
			form.entries = entries;
			res.render('form_single', form);
		});
	});
};

exports.create = function (req, res) {
	var id = Date.now();
	var requiredFields = req.body['validation-requireds'].split(',').map(function (field) {
		return field.trim();
	});
	db.put('form!' + id, {
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifySubject: req.body['notify-subject'] || 'New form submission',
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name'],
		validation: {
			requireds: requiredFields
		}
	}, function (err) {
		if (err) {
			console.error(err);
			return res.status(400).send();
		}
		res.status(200).json({
			created: true,
			id: id
		});
	});
};

exports.update = function (req, res) {
	var id = req.params.form_id;
	if (!id) {
		return res.status(400).send('Missing form ID.');
	}
	var requiredFields = req.body['validation-requireds'].split(',').map(function (field) {
		return field.trim();
	});
	var updatedForm = {
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifySubject: req.body['notify-subject'],
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name'],
		validation: {
			requireds: requiredFields
		}
	};
	db.get('form!' + id, function (err, form) {
		if (err) {
			return res.status(400).send();
		}
		db.put('form!' + id, Object.assign({}, form, updatedForm), function (err) {
			if (err) {
				return res.status(400).send();
			}
			return res.status(200).json({
				updated: true
			});
		});
	});
};

exports.newEntry = function (req, res) {
	var content = _.omit(req.body, 'form_id');
	var formId = req.body.form_id;
	var entryId = Date.now();

	db.get('form!' + formId, function (err, form) {
		if (err) {
			console.error('Unable to find form ' + formId + ' ' + err);
			return res.status(400).send();
		}
		var invalids = [];
		if (form.validation && form.validation.requireds) {
			form.validation.requireds.forEach(function (requiredField) {
				if (!content[requiredField]) {
					invalids.push(requiredField);
				}
			});
			if (invalids.length > 0) {
				return res.status(400).send('Invalid form submission.');
			}
		}
		db.put('entry!' + formId + '!' + entryId, content, function (err) {
			if (err) {
				console.error('Unable to add entry ' + err);
				return res.status(400).send('Unable to submit form.');
			}
			res.status(200).json({
				submitted: true
			});
			// send email notification

			// get the final entries length
			getFormEntries(formId, function (err, entries) {
				if (err) {
					return;
				}
				mailer.send(mailer.parse(content), {
					from: form.fromName + ' <' + form.fromEmail + '>',
					to: form.notifyEmail,
					subject: form.notifySubject + ' #' + entries.length,
					replyTo: content.name + ' <' + content.email + '>'
				});
			});
		});
	});
};
