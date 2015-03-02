'use strict';

/**
 * Module dependencies.
 */
var http = require('http'),
	express = require('express'),
	passport = require('passport'),
	flash = require('connect-flash'),
	config = require('./config'),
	errorPageHandler = require('./middlewares/error-page-handler'),
	httpsServer = require('./middlewares/https-server'),
	secureHeader = require('./middlewares/secure-header'),
	templateEngine = require('./middlewares/template-engine'),
	locals = require('./middlewares/locals'),
	staticFiles = require('./middlewares/static-files'),
	globbedFiles = require('./middlewares/globbed-files'),
	parser = require('./middlewares/parser'),
	mongoSession = require('./middlewares/mongo-session'),
	logger = require('./middlewares/logger');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	locals(app);

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	staticFiles(app);

	templateEngine(app);

	logger(app);

	parser(app);

	mongoSession(app, db);

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	secureHeader(app);

	globbedFiles(app);

	errorPageHandler(app);

	httpsServer(app);

	// Return Express server instance
	return app;
};