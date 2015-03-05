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

			survey1.$save({id: '1'}, function(response) {
				//$location.path('wechat/orders/new/' + response._id + '/success');
				$scope.clearSurvey1();
				$state.go('wechat-survey-success', {id: $stateParams.id});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.clearSurvey1 = function(){
			// Clear form fields
			$scope.survey1.channel = '';
			$scope.survey1.willOrder = '';
			$scope.survey1.acceptService = '';
			$scope.error = null;
		};
	}
);