'use strict';

module.exports = function(app) {
	// Routing logic   
	// ...
	var wechatApi = require('../../app/controllers/wechat-api.server.controller');

	app.route('/api/wechat/').post(wechatApi.index);
	app.route('/api/wechat/test').get(wechatApi.index);
	
};