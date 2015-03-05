'use strict';

//Setting up route
angular.module('wechat').config(['$stateProvider',
	function($stateProvider, $stateParams) {
		// Wechat state routing
		$stateProvider.
		state('wechat', {
			url: '/wechat',
			templateUrl: 'modules/wechat/views/wechat.client.view.html',
			subTitle: '开奶宝典'
		}).
		state('wechat-survey', {
			url: '/wechat/survey/:id',
			templateUrl: function($stateParams) {
				return 'modules/wechat/views/survey/survey'+ $stateParams.id +'.client.view.html';
			},			
			subTitle: '调查问卷'
		}).
		state('wechat-survey-success', {
			url: '/wechat/survey/:id/success',
			templateUrl: function($stateParams) {
				return 'modules/wechat/views/survey/survey'+ $stateParams.id +'-success.client.view.html';
			},			
			subTitle: '提交成功'
		}).
		state('wechat-my-orders', {
			url: '/wechat/orders/my',
			templateUrl: 'modules/wechat/views/my-orders.client.view.html',
			subTitle: '修改/取消订单'
		}).
		state('wechat-edit-order-success', {
			url: '/wechat/orders/:id/edit/success',
			templateUrl: 'modules/wechat/views/edit-order-success.client.view.html',
			subTitle: '订单修改成功'
		}).
		state('wechat-edit-order', {
			url: '/wechat/orders/:id/edit',
			templateUrl: 'modules/wechat/views/edit-order.client.view.html',
			subTitle: '修改/取消订单'
		}).
		state('wechat-new-order-success', {
			url: '/wechat/orders/new/:id/success',
			templateUrl: 'modules/wechat/views/new-order-success.client.view.html',
			subTitle: '下单成功'
		}).
		state('wechat-new-order', {
			url: '/wechat/orders/new',
			templateUrl: 'modules/wechat/views/new-order.client.view.html',
			subTitle: '下订单'
		}).
		state('wechat-about', {
			url: '/wechat/about',
			templateUrl: 'modules/wechat/views/about.client.view.html',
			subTitle: '关于奶牛帮'
		}).
		state('wechat-activities', {
			url: '/wechat/activities',
			templateUrl: 'modules/wechat/views/activities.client.view.html',
			subTitle: '最新活动'
		});
	}
]);