var mailer = (function() {
	var nodemailer = require('nodemailer');

	var smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: "tringuyenduy@gmail.com",
			pass: process.env.GMAIL_PASS
		}
	});

	console.log(process.env.GMAIL_PASS);

	var mailOptions = {
		from: "Tri Nguyen <tringuyenduy@gmail.com", // sender address
		to: "tringuyenduy@gmail.com", // list of receivers
		subject: "Inspired Forms", // Subject line
		text: "Hello world ✔", // plaintext body
		html: "<b>Hello world ✔</b>" // html body
	};

	var sendMail = function(){
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
			}else{
				console.log("Message sent: " + response.message);
			}

			// if you don't want to use this transport object anymore, uncomment following line
			//smtpTransport.close(); // shut down the connection pool, no more messages
		});
	};

	// export stuff
	exports.sendmail = sendMail;
}());