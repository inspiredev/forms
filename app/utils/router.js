const logger = require('./logger');

module.exports = function (controller) {
	return function (req, res) {
		controller(req, res)
			.then(null, (err) => {
				console.error(err);
				logger.error(err, req);
				// only send error message if res hasn't been sent
				if (!res.headersSent) {
					res.status(400).send(err.message);
				}
			});
	};
}
