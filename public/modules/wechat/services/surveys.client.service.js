'use strict';

angular.module('wechat').factory('Surveys', function($resource) {
	return $resource('surveys/:id', {
		id: '@_id'
	}, {
		
	});
});