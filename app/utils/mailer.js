'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const logger = require('./logger');

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
var parseContent = function (results) {
	return Object.keys(results).map(key => `${key}: ${results[key]}`)
		.join('\n\n');

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

var sendMail = function (content, options) {
	Object.assign(mailOptions, options);

	mailOptions.text = content;
	mailOptions.html = nl2br(content);
	// in dev, send to personal email
	if (process.env.NODE_ENV == 'development') {
		mailOptions.to = 'tri@tridnguyen.com';
	}
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, function (err, response) {
			if (err) {
				return reject(err);
			}
			logger.debug(response);
			// if you don't want to use this transport object anymore, uncomment following line
			// transporter.close(); // shut down the connection pool, no more messages
			resolve();
		});
	});
};

// export stuff
exports.send = sendMail;
exports.parse = parseContent;
