'use strict';

var config = require('../config'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')({
		session: session
	});

module.exports = function(app, db) {
	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));
};