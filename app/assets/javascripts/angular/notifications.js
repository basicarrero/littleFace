angular.module("lf.notifications", [])
	.controller('notificationsCtrl', function($scope, $interval, notifRes) {
		var INTERVAL = 10000; // miliseconds
    	$scope.maxItems = 5;
    	$scope.unReadCount = 0;
    	$scope.notifs = notifRes.query({limit: $scope.maxItems});
//    	$scope.notifs.$promise.then(
//				function(res) {
//					$scope.notifs = res;
//					$interval(function(){
//						var queryParams = {limit: $scope.maxItems};
//						if ($scope.notifs.length > 0) { queryParams.last = $scope.notifs[0].id; }
//						notifRes.query(queryParams).$promise.then(
//								function(res) {
//									console.log(res);
//									angular.forEach(res, function(r) {
//										$scope.notifs.unshift(r);
//										$scope.notifs.pop();
//										$scope.unReadCount += 1;
//									});
//								});
//					},INTERVAL);
//				});
    	
    	$scope.resetCounter = function() {
    		$scope.unReadCount = 0;
    	};
	})
	.directive('pulsingBadge', function($animate, $timeout) {
	    return {
            restrict : 'E',
            replace: true,
            scope : { counter: "=" },
            template : '<span class="badge" ng-show="counter !== 0">{{counter}}</span>',
            link : function($scope, $element, $attrs) {
	    		$scope.$watch("counter", function (val) {
	    			if (val) {
						$animate.addClass($element, 'pulse').then(function() {
							$timeout(function(){ 
								$animate.removeClass($element, 'pulse'); 
							}, 1000);
					    });
	    			}
	    		});
            }
	    };
	})
	.directive('notif', function() {
	    return {
            restrict : 'E',
            //replace: true,
            scope : { notif: "=" },
            template : '{{notif.id}} - {{notif.message}}',
            link : function($scope, $element, $attrs) {
            }
	    };
	});
