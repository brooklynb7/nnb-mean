'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);	
	}
]).run(['Menus','USER_ROLES',
	function(Menus, USER_ROLES) {

		Menus.addMenuItem('topbar', '用户管理', 'users', 'dropdown', '/users(/create)?', false, [USER_ROLES.super], 99);
		Menus.addSubMenuItem('topbar', 'users', '用户列表', 'users');
		//Menus.addSubMenuItem('topbar', 'users', '新建用户', 'users/create');
	}
]);