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