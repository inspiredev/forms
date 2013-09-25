var mailer = (function() {
	var nodemailer = require('nodemailer'),
		_ = require('underscore');

	var smtpTransport = nodemailer.createTransport('SMTP',{
		service: 'Gmail',
		auth: {
			user: 'tringuyenduy@gmail.com',
			pass: process.env.GMAIL_PASS
		}
	});

	console.log(process.env.GMAIL_PASS);

	var mailOptions = {
		from: 'Tri Nguyen <tringuyenduy@gmail.com', // sender address
		to: 'tringuyenduy@gmail.com', // list of receivers
		subject: 'Inspired Forms', // Subject line
		text: 'Hello world ✔', // plaintext body
		html: '<b>Hello world ✔</b>' // html body
	};

	// convert form entry into email content
	var parseContent = function(results) {
		var content = '';
		_.each(results, function(value, key){
			content += key + ': ';
			content += value + '\n';
		});
		return content;
	}

	var nl2br = function (str, is_xhtml) {
		// *     example 1: nl2br('Kevin\nvan\nZonneveld');
		// *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
		// *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
		// *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
		// *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
		// *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}

	var sendMail = function(content){
		mailOptions.text = content;
		mailOptions.html = nl2br(content);
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
			}else{
				console.log('Message sent: ' + response.message);
			}

			// if you don't want to use this transport object anymore, uncomment following line
			//smtpTransport.close(); // shut down the connection pool, no more messages
		});
	};

	// export stuff
	exports.sendmail = sendMail;
	exports.parse = parseContent;
}());