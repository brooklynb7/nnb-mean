'use strict';

angular.module('wechat').controller('WechatSurveyController',
	function($scope, $state, $stateParams, Authentication, Surveys) {
		$scope.authentication = Authentication;
		$scope.survey1 = {};

		$scope.nickName = $scope.authentication.user ? $scope.authentication.user.username : '';

		$scope.postSurvey1 = function() {
			var survey1 = new Surveys({
				channel: this.survey1.channel,
				willOrder: this.survey1.willOrder,
				acceptService: this.survey1.acceptService
			});

			survey1.$save({
				id: '1'
			}, function(response) {
				//$location.path('wechat/orders/new/' + response._id + '/success');
				$scope.clearSurvey1();
				$state.go('wechat-survey-success', {
					id: $stateParams.id
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.clearSurvey1 = function() {
			// Clear form fields
			$scope.survey1.channel = '';
			$scope.survey1.willOrder = '';
			$scope.survey1.acceptService = '';
			$scope.error = null;
		};

		$scope.share = function() {
			// 定义微信分享的数据
			var wxData = {
				'appId': '', // 服务号可以填写appId
				'imgUrl': 'http://photocdn.sohu.com/20130122/Img364302298.jpg',
				'link': 'http://www.baidufe.com',
				'desc': '使用警告：此Api非官方版本，请各位尽量将分享功能迁移至腾讯官方版，会更稳定些！',
				'title': '欢迎使用WeixinApi'
			};

			// 分享的回调
			var wxCallbacks = {
				// 收藏操作是否触发回调，默认是开启的
				favorite: false,

				// 分享操作开始之前
				ready: function() {
					// 你可以在这里对分享的数据进行重组
					alert('准备分享');
				},
				// 分享被用户自动取消
				cancel: function(resp) {
					// 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
					alert('分享被取消，msg=' + resp.err_msg);
				},
				// 分享失败了
				fail: function(resp) {
					// 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
					alert('分享失败，msg=' + resp.err_msg);
				},
				// 分享成功
				confirm: function(resp) {
					// 分享成功了，我们是不是可以做一些分享统计呢？
					alert('分享成功，msg=' + resp.err_msg);
				},
				// 整个分享过程结束
				all: function(resp, shareTo) {
					// 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
					alert('分享' + (shareTo ? '到' + shareTo : '') + '结束，msg=' + resp.err_msg);
				}
			};
			// 自定义分享到：微信好友、朋友圈、腾讯微博、QQ好友
			WeixinApi.share(wxData, wxCallbacks);
		};
	}
);