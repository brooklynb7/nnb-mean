'use strict';

angular.module('wechat').controller('WechatController',
	function($scope, $http, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;
		$scope.daysAfterBearing = '1';
		$scope.hasFever = '';
		$scope.daysAfterBearingOptions = [{
			id: '1',
			value: '1天'
		}, {
			id: '2',
			value: '2天'
		}, {
			id: '3',
			value: '3天'
		}, {
			id: '4',
			value: '4天'
		}, {
			id: '5',
			value: '5天'
		}, {
			id: '6',
			value: '6天'
		}, {
			id: '7',
			value: '7天'
		}, {
			id: '8',
			value: '8天'
		}, {
			id: '9',
			value: '9天'
		}, {
			id: '10',
			value: '10天'
		}, {
			id: '11',
			value: '11天'
		}, {
			id: '12',
			value: '12天'
		}, {
			id: '13',
			value: '13天'
		}, {
			id: '14',
			value: '14天'
		}, {
			id: '15',
			value: '15天'
		}, {
			id: '16',
			value: '大于15天'
		}];

		$scope.nickName = $scope.authentication.user ? $scope.authentication.user.username : '';

		if ($scope.authentication.user) {
			$scope.myLatestOrder = Orders.myLatest(function(order) {
				$scope.phone = order.phone;
			});
		}

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders({
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

		$scope.myOrder = function() {
			$scope.order = Orders.myLatest();
		};
	}
);