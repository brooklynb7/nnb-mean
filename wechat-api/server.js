'use strict'

var init = require('../config/init')(),
	express = require('express'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	path = require('path'),
	config = require('./config'),
	logger = require('../config/logger'),
	parser = require('../config/parser'),
	viewEngine = require('../config/view-engine'),
	errorHandler = require('../config/error-handler'),
	routes = require('./routes');

var app = express();

viewEngine.set(app);

app.use(logger.format2);

parser(app);

routes(app);

// Setting the app router and static folder
app.use(express.static(path.resolve('../public')));

app.set('port', config.wechat.port);

var server = app.listen(app.get('port'), function() {
	console.log('NNB Wechat-API server listening on port ' + server.address().port);
});