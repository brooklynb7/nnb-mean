'use strict';

var compress = require('compression'),
	path = require('path'),
	express = require('express');

module.exports = function(app) {
	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));
};