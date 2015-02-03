'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'nnb';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('orders');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('wechat');

'use strict';

// Core module config
angular.module('core')
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	})
	.constant('USER_ROLES', {
		all: '*',
		user: 'user',
		service: 'service',
		admin: 'admin',
		super: 'super'
	});
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('403', {
			url: '/403',
			templateUrl: 'modules/core/views/403.client.view.html'
		}).
		state('401', {
			url: '/401',
			templateUrl: 'modules/core/views/401.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]).run(['$rootScope', '$state', '$location', 'Authentication', 'USER_ROLES', 'AUTH_EVENTS',
		function($rootScope, $state, $location, Authentication, USER_ROLES, AUTH_EVENTS) {
			$rootScope.$on('$stateChangeStart', function(event, nextRoute, currentRoute) {
				var subTitle = nextRoute.subTitle;
				if(subTitle) {
					document.title = '奶牛帮 - ' + subTitle;
				} else {
					document.title = '奶牛帮';
				}

				var authorizedRoles = nextRoute.authorizedRoles;
				if (angular.isArray(authorizedRoles) && authorizedRoles.length > 0 &&
					!Authentication.isAuthorized(authorizedRoles)) {
					event.preventDefault();
					if (Authentication.isAuthenticated()) {
						// user is not allowed
						$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
					} else {
						// user is not logged in
						$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
					}
				}
			});

			$rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
				$state.go('401');
			});

			$rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
				$state.go('403');
			});
		}
	]);
'use strict';

angular.module('core').controller('CoreController', ['$scope', '$location', 'USER_ROLES',
	function($scope, $location, USER_ROLES) {
		$scope.userRoles = USER_ROLES;

		$scope.loading = false;

		$scope.showLoading = function(isShow){
			$scope.loading = isShow;
		};
		
		$scope.$on('$stateChangeSuccess', function() {
			if($location.path().indexOf('/wechat') === 0) {
				$scope.hideHeader = true;	
			} else {
				$scope.hideHeader = false;
			}
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

angular.module('core').filter('hasIntersection', [
	function() {
		return function(array1, array2) {
			for (var index1 in array1) {
				for (var index2 in array2) {
					if (array2[index2] === array1[index1]) {
						return true;
					}
				}
			}
			return false;
		};
	}
]).filter('hasValue', [
	function() {
		return function(array, value) {
			for (var index in array) {
				if (array[index] === value) {
					return true;
				}
			}
			return false;
		};
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('orders').run(['Menus','USER_ROLES',
	function(Menus, USER_ROLES) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '订单', 'orders', 'dropdown', '/orders(/create)?', false, [USER_ROLES.service]);
		Menus.addSubMenuItem('topbar', 'orders', '订单列表', 'orders');
		Menus.addSubMenuItem('topbar', 'orders', '新建订单', 'orders/create');
	}
]);
'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider', 'USER_ROLES',
	function($stateProvider, USER_ROLES) {
		// Orders state routing
		$stateProvider.
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/list-orders.client.view.html',
			authorizedRoles: [USER_ROLES.service]
		}).
		state('createOrder', {
			url: '/orders/create',
			templateUrl: 'modules/orders/views/create-order.client.view.html',
			authorizedRoles: [USER_ROLES.service]
		}).
		state('viewOrder', {
			url: '/orders/:id',
			templateUrl: 'modules/orders/views/view-order.client.view.html',
			authorizedRoles: [USER_ROLES.service]
		}).
		state('editOrder', {
			url: '/orders/:id/edit',
			templateUrl: 'modules/orders/views/edit-order.client.view.html',
			authorizedRoles: [USER_ROLES.service]
		});
	}
]);
'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;
		$scope.daysAfterBearing = '1';
		$scope.hasFever = '';
		$scope.daysAfterBearingOptions = [
			{id:'1',value:'1天'},
			{id:'2',value:'2天'},
			{id:'3',value:'3天'},
			{id:'4',value:'4天'},
			{id:'5',value:'5天'},
			{id:'6',value:'6天'},
			{id:'7',value:'7天'},
			{id:'8',value:'8天'},
			{id:'9',value:'9天'},
			{id:'10',value:'10天'},
			{id:'11',value:'11天'},
			{id:'12',value:'12天'},
			{id:'13',value:'13天'},
			{id:'14',value:'14天'},
			{id:'15',value:'15天'},
			{id:'16',value:'大于15天'}
		];
		$scope.statusOptions = [
			{id: -1, value:'已取消'},
			{id: 0, value:'新订单'},
			{id: 1, value:'已确认'},
			{id: 2, value:'已完成'}
		];

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				name: this.name,
				nickName: this.nickName,
				phone: this.phone,
				address: this.address,
				daysAfterBearing: this.daysAfterBearing,
				hasFever: this.hasFever ? true : false
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.nickName = '';
				$scope.phone = '';
				$scope.address = '';
				$scope.daysAfterBearing = '1';
				$scope.hasFever = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.cancel = function(order) {
			if (window.confirm('你确定要取消这个订单吗?')) {
				if (order) {
					order.$cancel();

					for (var i in $scope.orders) {
						if ($scope.orders[i] === order) {
							$scope.orders.splice(i, 1);
						}
					}
				} else {
					$scope.order.$cancel(function() {
						$location.path('orders');
					});
				}
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;
			order.status = parseInt($scope.order.status);

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.showLoading(true);
			$scope.orders = Orders.query();
			$scope.orders.$promise.finally(function(){
				$scope.showLoading(false);
			});
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				id: $stateParams.id
			});
		};
	}
]);
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
			return hasFever ? '是' : '否';
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
'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
	function($resource) {
		return $resource('orders/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			cancel: {
				method: 'PUT',
				url: 'orders/:id/cancel'
			},
			myLatest: {
				method: 'GET',
				url: 'orders/my/latest'
			}
		});
	}
]);
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
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('users-list', {
			url: '/users',
			templateUrl: 'modules/users/views/list-users.client.view.html'
		}).
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
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
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('./auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('./auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
	function($scope, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;

		$scope.find = function() {
			$scope.users = Orders.query();
		};

	}
]);
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
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['hasIntersectionFilter',
	function(hasIntersectionFilter) {
		var _this = this;

		var authService = {
			user: window.user
		};

		authService.isAuthenticated = function() {			
			return !! authService.user._id;
		};

		authService.isAuthorized = function(authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() &&
				hasIntersectionFilter(authorizedRoles, authService.user.roles));
		};

		return authService;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('wechat').config(['$stateProvider',
	function($stateProvider) {
		// Wechat state routing
		$stateProvider.
		state('wechat-my-orders', {
			url: '/wechat/orders/my',
			templateUrl: 'modules/wechat/views/my-orders.client.view.html',
			subTitle: '修改/取消订单'
		}).
		state('wechat-edit-order-success', {
			url: '/wechat/orders/:id/edit/success',
			templateUrl: 'modules/wechat/views/edit-order-success.client.view.html',
			subTitle: '订单修改成功'
		}).
		state('wechat-edit-order', {
			url: '/wechat/orders/:id/edit',
			templateUrl: 'modules/wechat/views/edit-order.client.view.html',
			subTitle: '修改/取消订单'
		}).
		state('wechat-new-order-success', {
			url: '/wechat/orders/new/:id/success',
			templateUrl: 'modules/wechat/views/new-order-success.client.view.html',
			subTitle: '下单成功'
		}).
		state('wechat-new-order', {
			url: '/wechat/orders/new',
			templateUrl: 'modules/wechat/views/new-order.client.view.html',
			subTitle: '下订单'
		}).
		state('about', {
			url: '/wechat/about',
			templateUrl: 'modules/wechat/views/about.client.view.html',
			subTitle: '关于奶牛帮'
		}).
		state('wechat-activities', {
			url: '/wechat/activities',
			templateUrl: 'modules/wechat/views/activities.client.view.html',
			subTitle: '最新活动'
		}).
		state('wechat', {
			url: '/wechat',
			templateUrl: 'modules/wechat/views/wechat.client.view.html',
			subTitle: '开奶宝典'
		});
	}
]);
'use strict';

angular.module('wechat').controller('WechatController', ['$scope','$http', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope,$http, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;
		$scope.daysAfterBearing = '1';
		$scope.hasFever = '';
		$scope.daysAfterBearingOptions = [
			{id:'1',value:'1天'},
			{id:'2',value:'2天'},
			{id:'3',value:'3天'},
			{id:'4',value:'4天'},
			{id:'5',value:'5天'},
			{id:'6',value:'6天'},
			{id:'7',value:'7天'},
			{id:'8',value:'8天'},
			{id:'9',value:'9天'},
			{id:'10',value:'10天'},
			{id:'11',value:'11天'},
			{id:'12',value:'12天'},
			{id:'13',value:'13天'},
			{id:'14',value:'14天'},
			{id:'15',value:'15天'},
			{id:'16',value:'大于15天'}
		];

		$scope.nickName = $scope.authentication.user ? $scope.authentication.user.username : '';
		
		if($scope.authentication.user) {
			$scope.myLatestOrder = Orders.myLatest(function(order){
				$scope.phone = order.phone;
			});
		}

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				nickName: this.nickName,
				phone: this.phone,
				address: this.address,
				daysAfterBearing: this.daysAfterBearing,
				hasFever: this.hasFever ? true : false
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('wechat/orders/new/' + response._id + '/success');

				// Clear form fields
				$scope.nickName = '';
				$scope.phone = '';
				$scope.address = '';
				$scope.daysAfterBearing = '1';
				$scope.hasFever = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.cancel = function(order) {
			if (window.confirm('你确定要取消这个订单吗?')) {
				if (order) {
					order.$cancel();

					for (var i in $scope.orders) {
						if ($scope.orders[i] === order) {
							$scope.orders.splice(i, 1);
						}
					}
				} else {
					$scope.order.$cancel(function() {
						$location.path('wechat/orders/new');
					});
				}
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('wechat/orders/' + order._id + '/edit/success');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Order
		$scope.findOne = function() {			
			$scope.order = Orders.get({ 
				id: $stateParams.id
			});
		};

		$scope.myOrder = function(){
			$scope.order = Orders.myLatest();
		};
	}
]);