'use strict';

const omit = require('lodash.omit');
const db = require('../../db');
const firestore = require('@tridnguyen/firestore');
const mailer = require('../utils/mailer');

exports.showAll = function (req, res) {
	firestore.collection('forms')
		.get()
		.then(formsSnapshot => {
			return formsSnapshot.docs.map(formDoc => formDoc.data());
		})
		.then(forms => {
			if (req.query.type == 'json') {
				return res.json(forms);
			}
			res.render('forms', {forms});
		})
		.then(null, err => {
			console.error(err);
			res.sendStatus(400);
		});
};

exports.show = function (req, res) {
	const formId = req.params.form_id;
	const formRef = firestore.doc(`forms/${formId}`);
	formRef.get().then(formSnapshot => {
		if (!formSnapshot.exists) {
			return res.sendStatus(404);
		}

		return firestore.collection(`forms/${formId}/entries`)
			.get()
			.then(entriesSnapshot => {
				return entriesSnapshot.docs.map(entryDoc => entryDoc.data());
			})
			.then(entries => {
				const form = formSnapshot.data();
				form.entries = entries;
				if (req.query.type == 'json') {
					return res.json(form);
				}
				res.render('form_single', form);
			});
	}).then(null, err => {
		console.error(err);
		res.sendStatus(400);
	});
};

exports.create = function (req, res) {
	const id = Date.now();
	const requiredFields = req.body['validation-requireds'].split(',')
		.map(field => field.trim());
	const formDoc = firestore.doc(`forms/${id}`);
	formDoc.set({
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifyEmailType: req.body['notify-email-type'],
		notifyEmailCc: req.body['notify-email-cc'] || '',
		notifySubject: req.body['notify-subject'] || 'New form submission',
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name'],
		requireds: requiredFields
	}).then(() => {
		res.json({
			created: true,
			id: id
		});
	}).then(null, err => {
		console.error(err);
		res.sendStatus(400);
	});
};

exports.update = function (req, res) {
	const id = req.params.form_id;
	if (!id) {
		return res.status(400).send('Missing form ID.');
	}
	const updatedForm = {
		name: req.body.name,
		notifyEmail: req.body['notify-email'],
		notifyEmailType: req.body['notify-email-type'],
		notifySubject: req.body['notify-subject'],
		fromEmail: req.body['from-email'],
		fromName: req.body['from-name']
	};
	if (req.body['validation-required']) {
		updatedForm.requireds = req.body['validation-requireds'].split(',')
			.map(field => field.trim());
	}
	if (req.body['notify-email-cc']) {
		updatedForm.notifyEmailCc = req.body['notify-email-cc'];
	}
	const formRef = firestore.doc(`forms/${id}`);
	formRef.set(updatedForm, { merge: true }).then(() => {
		res.json({
			updated: true
		});
	}).then(null, err => {
		console.error(err);
		res.sendStatus(400);
	})
};

exports.newEntry = function (req, res) {
	const formId = req.body.form_id;
	const content = omit(req.body, 'form_id');
	const entryId = Date.now();

	const formRef = firestore.doc(`forms/${formId}`);
	formRef.get().then(formSnapshot => {
		if (!formSnapshot.exists) {
			throw new Error(`Unable to find form ${formId}`);
		}
		const form = formSnapshot.data();

		if (form.requireds) {
			const invalids = form.requireds.reduce((invalids, requiredField) => {
				if (!content[requiredField]) {
					invalids.push(requiredField);
				}
				return invalids;
			});
			if (invalids.length > 0) {
				throw new Error(`Missing fields: ${invalids.join(', ')}`);
			}
		}
		const entryRef = firestore.doc(`forms/${formId}/entries/${entryId}`);

		return entryRef.set(content).then(() => {
			res.status(200).json({
				submitted: true
			});
		});
	}).then(() => {
		// send email notification
		const entriesCollectionRef = firestore.collection(`forms/${formId}/entries`);
		entriesCollectionRef.get().then(entriesCollectionSnapshot => {
			const toAddress = form.notifyEmail;
			// if notify email address is to be mapped to a field
			if (form.notifyEmailType && form.notifyEmailType === 'field') {
				toAddress = content[form.notifyEmail];
			}
			mailer.send(mailer.parse(content), {
				from: form.fromName + ' <' + form.fromEmail + '>',
				to: toAddress,
				cc: form.notifyEmailCc || '',
				subject: form.notifySubject + ' #' + entriesCollectionSnapshot.size,
				replyTo: content.name + ' <' + content.email + '>'
			});
		});
	}).then(null, err => {
		console.error(err);
		res.status(400).send(err.message);
	});
};
