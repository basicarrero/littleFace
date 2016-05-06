angular.module("lf.common", [])
	.controller('commonCtrl',['$scope', '$interval', '$filter', 'ngAudio', 'userRes', 'notifRes', function($scope, $interval, $filter, ngAudio, userRes, notifRes) {
    	// User Info
    	$scope.friends = [];
		$scope.notifs = [];
		$scope.frRequests = [];
		$scope.sound = ngAudio.load("/audio/notif.mp3");
    	$scope.maxNotifs = 9;
    	$scope.newNotifsCount = 0;
    	
		userRes.get({action: 'current'}).$promise.then(
				function(res) {
					$scope.user = res.user;
					if (res.friends)
						$scope.friends = res.friends;
					if (res.requests)
						$scope.frRequests = res.requests;
					
					// Notifications
					var INTERVAL = 50000;
			    	$scope.notifs = notifRes.query({user_id: $scope.user.id, limit: $scope.maxNotifs});
			    	$scope.notifs.$promise.then(
							function(res) {
								$scope.notifs = res;
								$interval(function(){
									var queryParams = {user_id: $scope.user.id, limit: $scope.maxNotifs};
									if ($scope.notifs.length > 0) { queryParams.last = $scope.notifs[0].id; }
									notifRes.query(queryParams).$promise.then(
											function(res) {
												console.log(res);
												angular.forEach(res.slice().reverse(), function(r) {
													$scope.notifs.unshift(r);
													if (r.n_type == 'friendship')
														$scope.frRequests.push(r);
													if ($scope.notifs.length > $scope.maxNotifs)
														$scope.notifs.pop();
													$scope.newNotifsCount += 1;
													$scope.sound.play();
												});
											});
								},INTERVAL);	// milliseconds
							});
				},
				function(err) { 
					console.log(err);
		});
		
    	$scope.resetNotifCounter = function() {
    		$scope.newNotifsCount = 0;
    	};
		
		$scope.resolveUsers = function(idLst) {
			var res = [];
			angular.forEach(idLst, function(id) {
				  if (id === $scope.user.id) { 
					  res.push($scope.user);
				  }else {
					  var friend = $filter('filter')($scope.friends, {id: id}, true);
					  if (friend.length > 0) {
						  res.push(friend[0]);
					  }
				  }
			});
			return res;
		};
	}])
	.directive('pulsingBadge',['$animate', '$timeout', function($animate, $timeout) {
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
	}])
	.directive('notif', function() {
	    return {
            restrict : 'E',
            scope : { notif: "=" },
            template : '<p><i class="glyphicon"></i>&nbsp;{{notif.message}}</p>',
            link : function($scope, $element, $attrs) {
            	var ico = $element.find('i');
            	if ($scope.notif.n_type === 'like')
            		ico.addClass('glyphicon-thumbs-up');
            	if ($scope.notif.n_type === 'friendship')
            		ico.addClass('glyphicon-user');
            }
	    };
	});
