'use strict';

angular.module('core').controller('CoreController', ['$scope', '$location', 'USER_ROLES',
	function($scope, $location, USER_ROLES) {
		$scope.userRoles = USER_ROLES;
		
		$scope.$on('$stateChangeSuccess', function() {
			if($location.path().indexOf('/wechat') === 0) {
				$scope.hideHeader = true;	
			} else {
				$scope.hideHeader = false;
			}
		});
	}
]);