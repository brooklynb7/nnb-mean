'use strict';

// Configuring the Articles module
angular.module('orders').run(['Menus','USER_ROLES',
	function(Menus, USER_ROLES) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '订单', 'orders', 'dropdown', '/orders(/create)?', false, [USER_ROLES.service]);
		Menus.addSubMenuItem('topbar', 'orders', '订单列表', 'orders');
		Menus.addSubMenuItem('topbar', 'orders', '新建订单', 'orders/create');
	}
]);