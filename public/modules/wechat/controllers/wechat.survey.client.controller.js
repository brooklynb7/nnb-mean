'use strict';

angular.module('wechat').controller('WechatSurveyController',
	function($scope, $stateParams, Authentication, Surveys) {
		$scope.authentication = Authentication;
		$scope.survey1 = {};

		$scope.postSurvey1 = function() {
			var survey1 = new Surveys({
				channel: this.survey1.channel,
				willOrder: this.survey1.willOrder,
				acceptService: this.survey1.acceptService
			});

			survey1.$save({id: '1'}, function(response) {
				//$location.path('wechat/orders/new/' + response._id + '/success');

				// Clear form fields
				$scope.survey1.channel = '';
				$scope.survey1.willOrder = '';
				$scope.survey1.acceptService = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
);