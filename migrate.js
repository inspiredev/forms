#!/usr/bin/env node

var db = require('./db');
var backup = require('./data/backup.json');

var entries = [];

var forms = backup.map(function (form) {
	form.entries.forEach(function (entry) {
		entries.push({
			type: 'put',
			key: 'entry!' + form._id + '!' + entry._id,
			value: entry.content
		});
	});
	return {
		type: 'put',
		key: 'form!' + form._id,
		value: {
			fromEmail: form.fromEmail,
			fromName: form.fromName,
			name: form.name,
			notifyEmail: form.notifyEmail,
			notifySubject: form.notifySubject,
			validation: form.validation
		}
	};
});

db.batch(forms.concat(entries), function (err) {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log('Migrated ' + forms.length + ' forms and ' + entries.length + ' entries.');
	process.exit();
});
