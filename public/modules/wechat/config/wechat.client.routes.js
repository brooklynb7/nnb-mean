'use strict';

//Setting up route
angular.module('wechat').config(['$stateProvider',
	function($stateProvider) {
		// Wechat state routing
		$stateProvider.
		state('wechat-edit-order-success', {
			url: '/wechat/orders/:id/edit/success',
			templateUrl: 'modules/wechat/views/edit-order-success.client.view.html'
		}).
		state('wechat-edit-order', {
			url: '/wechat/orders/:id/edit',
			templateUrl: 'modules/wechat/views/edit-order.client.view.html'
		}).
		state('wechat-new-order-success', {
			url: '/wechat/orders/new/:id/success',
			templateUrl: 'modules/wechat/views/new-order-success.client.view.html'
		}).
		state('wechat-new-order', {
			url: '/wechat/orders/new',
			templateUrl: 'modules/wechat/views/new-order.client.view.html'
		}).
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