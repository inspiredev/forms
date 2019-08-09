const Rollbar = require('rollbar');

module.exports = new Rollbar({
	accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
	captureUncaught: true,
	captureUnhandledRejections: true,
	environment: process.env.NODE_ENV
});
