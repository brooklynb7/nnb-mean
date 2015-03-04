'use strict';

var config = require('../../config/config');

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var surveys = require('../../app/controllers/surveys.server.controller');

	app.route('/surveys/1')
		.post(surveys.insertSurvey1);

};
