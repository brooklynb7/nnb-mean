'use strict';

//Setting up route
angular.module('wechat').config(['$stateProvider',
	function($stateProvider) {
		// Wechat state routing
		$stateProvider.
		state('about', {
			url: '/wechat/about',
			templateUrl: 'modules/wechat/views/about.client.view.html'
		}).
		state('wechat-activities', {
			url: '/wechat/activities',
			templateUrl: 'modules/wechat/views/activities.client.view.html'
		}).
		state('wechat', {
			url: '/wechat',
			templateUrl: 'modules/wechat/views/wechat.client.view.html'
		});
	}
]);