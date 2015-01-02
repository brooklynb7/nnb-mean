'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
	function($resource) {
		return $resource('orders/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			cancel: {
				method: 'PUT',
				url: 'orders/:id/cancel'
			}
		});
	}
]);