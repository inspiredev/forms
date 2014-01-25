var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var entrySchema = new Schema({
	form_id: String,
	content: {}
});

var formSchema = new Schema({
	name: String,
	notifyName: String,
	notifyEmail: String,
	notifySubject: String,
	entries: [entrySchema]
});

mongoose.model('Form', formSchema);
mongoose.model('Entry', entrySchema);