'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
	function($scope, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;

		$scope.find = function() {
			$scope.users = Orders.query();
		};

	}
]);