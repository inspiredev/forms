'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var _ = require('lodash');

var transporter = nodemailer.createTransport(smtpTransport({
	service: 'Mailgun',
	auth: {
		user: process.env.INSPIRED_FORMS_MAIL_USER,
		pass: process.env.INSPIRED_FORMS_MAIL_PASS
	}
}));
var mailOptions = {
	from: 'Inspired Form <postmaster@inspiredev.co>',
	replyTo: 'noreply@inspiredev.co',
	subject: 'Inspired Forms Notification',
	text: 'Hello world ✔', // plaintext body
	html: '<b>Hello world ✔</b>' // html body
};

// convert form entry into email content
var parseContent = function(results) {
	var content = '';
	_.each(results, function(value, key){
		content += key + ': ';
		content += value + '\n\n';
	});
	return content;
};

var nl2br = function (str, is_xhtml) {
	// *     example 1: nl2br('Kevin\nvan\nZonneveld');
	// *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
	// *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
	// *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
	// *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
	// *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};

var sendMail = function(content, options){
	// if there are options, parse them
	if (!_.isEmpty(options)) {
		_.extend(mailOptions, options);
	}
	mailOptions.text = content;
	mailOptions.html = nl2br(content);
	transporter.sendMail(mailOptions, function (err, response) {
		if (err){
			console.error(err);
		} else{
			console.log('Message sent: ' + response.message);
		}

		// if you don't want to use this transport object anymore, uncomment following line
		//transporter.close(); // shut down the connection pool, no more messages
	});
};

// export stuff
exports.send = sendMail;
exports.parse = parseContent;
