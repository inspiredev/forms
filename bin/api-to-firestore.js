require('dotenv').config();

const chunk = require('lodash.chunk');

const firestore = require('@tridnguyen/firestore');

const { getJson } = require('simple-fetch');

const serverUrl = process.env.SYNC_FROM_SERVER_URL;

getJson(`${serverUrl}?type=json`)
	.then(forms => {
		return Promise.all(forms.map(form => {
			console.log(`Syncing form ${form.name}`)
			const formRef = firestore.doc(`forms/${form.id}`)
			formRef.get().then(formSnapshot => {
				if (formSnapshot.exists) {
					console.log(`Removing existing form ${form.id}`);
					return firestore.deleteCollection(`forms/${form.id}/entries`).then(() => {
						return formRef.delete();
					})
				}
			}).then(() => {
				return formRef.set(form)
					.then(() => {
						console.log(`Created form  ${form.id}`);
						return writeEntriesInChunks(form.id);
					})
			});
		}))
	}).then(null, err => {
		console.error(err);
	});

function writeEntriesInChunks(formId) {
	return getJson(`${serverUrl}/${formId}?type=json`).then(form => {
		if (!form.entries.length) {
			return;
		}
		console.log(`Writing ${form.entries.length} entries for form ${formId}...`);
		const entriesChunks = chunk(form.entries, firestore.batchSize);

		return Promise.all(
			entriesChunks.map(writeEntries.bind(null, formId))
		).then(() => {
			console.log(`Finished writing all entries for form ${formId}`);
		})
	})
}

function writeEntries(formId, entries) {
	const writeBatch = firestore.batch();

	entries.forEach(entry => {
		const entryRef = firestore.doc(`forms/${formId}/entries/${entry.id}`);
		writeBatch.set(entryRef, entry);
	});

	return writeBatch.commit().then(() => {
		console.log(`Wrote ${entries.length} entries for form ${formId}`);
	})
}
