'use strict';

angular.module('wechat').controller('WechatSurveyController', function($scope, $http, $stateParams, Authentication) {
	$scope.authentication = Authentication;

});