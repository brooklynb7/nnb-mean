'use strict';

angular.module('core').controller('CoreController', ['$scope', '$location', 
	function($scope, $location) {
		$scope.$on('$stateChangeSuccess', function() {
			if($location.path().indexOf('/wechat') === 0) {
				$scope.hideHeader = true;	
			} else {
				$scope.hideHeader = false;
			}
		});
	}
]);