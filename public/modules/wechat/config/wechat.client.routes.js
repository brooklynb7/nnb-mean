'use strict';

//Setting up route
angular.module('wechat').config(['$stateProvider',
	function($stateProvider) {
		// Wechat state routing
		$stateProvider.
		state('wechat', {
			url: '/wechat',
			templateUrl: 'modules/wechat/views/wechat.client.view.html'
		});
	}
]);