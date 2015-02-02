'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location' ,'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.remember = function(){
			$scope.credentials = {};
			$scope.rememberMe = localStorage.getItem('rememberMe') === 'true' ? true:false;
			$scope.credentials.username = localStorage.getItem('user') || '';
			$scope.credentials.password = localStorage.getItem('pwd') || '';
		};

		$scope.signup = function() {
			$scope.showLoading(true);
			$http.post('./auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			}).finally(function(){
				$scope.showLoading(false);
			});
		};

		$scope.signin = function() {
			$scope.showLoading(true);

			
			$http.post('./auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				localStorage.setItem('rememberMe', $scope.rememberMe);
				if($scope.rememberMe){
					localStorage.setItem('user', $scope.credentials.username);
					localStorage.setItem('pwd', $scope.credentials.password);
				} else {
					localStorage.removeItem('user');
					localStorage.removeItem('pwd');
				}
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			}).finally(function(){
				$scope.showLoading(false);
			});
		};
	}
]);