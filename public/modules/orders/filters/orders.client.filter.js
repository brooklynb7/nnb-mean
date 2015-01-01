'use strict';

angular.module('orders').filter('getDaysAfterBearingText', [
	function() {
		return function(value, list) {
			var obj = _.find(list, function(obj){
				return parseInt(obj.id) === parseInt(value);
			});
			return obj ? obj.value: '' ;
		};
	}
]).filter('getHasFeverText', [
	function(){
		return function(hasFever){
			return hasFever?'有':'无';
		};
	}
]);