'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Survey1 = mongoose.model('Survey1'),
	_ = require('lodash');

/**
 * Insert survey1
 */
exports.insertSurvey1 = function(req, res) {
	var survey1 = new Survey1(req.body);
	survey1.user = req.user;

	survey1.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(survey1);
		}
	});
};