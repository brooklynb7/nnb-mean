'use strict';

angular.module('orders').filter('getDaysAfterBearingText', [
	function() {
		return function(value, list) {
			var obj = _.find(list, function(obj) {
				return parseInt(obj.id) === parseInt(value);
			});
			return obj ? obj.value : '';
		};
	}
]).filter('getHasFeverText', [
	function() {
		return function(hasFever) {
			return hasFever ? '有' : '无';
		};
	}
]).filter('getOrderStatusText', [
	function() {
		return function(status) {
			var text = '';
			switch (status) {
				case 0:
					text = '新订单';
					break;
				case -1:
					text = '已取消';
					break;
				case 1:
					text = '已确认';
					break;
				case 2:
					text = '已完成';
					break;
				default:
					break;
			}
			return text;
		};
	}
]);