const logger = require('./logger');

module.exports = function (controller) {
	return function (req, res) {
		controller(req, res)
			.then(null, (err) => {
				console.error(err);
	}).then(null, err => {
		console.error(err);
		logger.error('Error creating new form entry', err, req);
		res.status(400).send(err.message);
	});
}
