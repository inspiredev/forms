const logger = require('./logger');

module.exports = function (controller) {
	return function (req, res) {
		controller(req, res)
			.then(null, (err) => {
				console.error(err);
				logger.error(err, req);
				res.sendStatus(400);
			});
	}
}
