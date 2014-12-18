'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...
	var wechatApi = require('../../app/controllers/wechat-api.server.controller');

	app.use('/api/wechat/', wechatApi.index);
	app.route('/api/wechat/createMenu').get(wechatApi.createMenu);
	app.route('/api/wechat/test').get(wechatApi.test);
	
};