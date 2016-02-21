'use strict';

var level = require('level');

module.exports = level('./data', {valueEncoding: 'json'});
