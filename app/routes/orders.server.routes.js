'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var orders = require('../../app/controllers/orders.server.controller');

	// Orders Routes
	app.route('/orders')
		.get(orders.list)
		.post(/*users.requiresLogin,*/ orders.create);

	app.route('/orders/my/latest')
		.get(users.requiresLogin, orders.myLatest);

	app.route('/orders/:orderId')
		.get(orders.read)
		.put(users.requiresLogin, orders.hasAuthorization, orders.update)
		.delete(users.requiresLogin, orders.hasAuthorization, orders.delete);

	app.route('/orders/:orderId/cancel')
		.put(users.requiresLogin, orders.hasAuthorization, orders.cancel);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
