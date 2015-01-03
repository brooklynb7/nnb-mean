'use strict';

var getRoleText = function(role) {
	var text = '';
	switch (role) {
		case 'super':
			text = '超级管理员';
			break;
		case 'admin':
			text = '管理员';
			break;
		case 'service':
			text = '客服';
			break;
		case 'user':
			text = '普通用户';
			break;
		default:
			break;
	}
	return text;
};

angular.module('users').filter('getRolesText', [
	function() {
		return function(list) {
			var testList = [];
			_.each(list, function(role) {
				testList.push(getRoleText(role));
			});
			return testList.join(',');
		};
	}
]);