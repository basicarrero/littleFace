angular.module("lf.common", [])
	.controller('commonCtrl', function($scope, $interval, $filter, ngAudio, userRes, notifRes) {
		// Notifications
		$scope.notifs = [];
		var startNotifPooling = function(interval) {
			$scope.sound = ngAudio.load("/audio/notif.mp3");
	    	$scope.maxNotifs = 9;
	    	$scope.newNotifsCount = 0;
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
											$scope.notifs.pop();
											$scope.newNotifsCount += 1;
											$scope.sound.play();
										});
									});
						},interval);
					});
		};
    	
    	$scope.resetNotifCounter = function() {
    		$scope.newNotifsCount = 0;
    	};
    	
    	// User Info
    	$scope.friends = [];
		userRes.get({action: 'current'}).$promise.then(
				function(res) {
					$scope.user = res.user;
					if (res.friends)
						$scope.friends = res.friends;
					else 
						$scope.friends = [];
					if (res.requests)
						$scope.frRequests = res.requests;
					else
						$scope.frRequests = [];
					
					startNotifPooling(100000);  // milliseconds
				},
				function(err) { 
					console.log(err);
		});
		
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
            scope : { notif: "=" },
            template : '<p><i class="glyphicon"></i>&nbsp;{{notif.message}}</p>',
            link : function($scope, $element, $attrs) {
            	var ico = $element.find('i');
            	if ($scope.notif.nType === 'like')
            		ico.addClass('glyphicon-thumbs-up');
            	if ($scope.notif.nType === 'frienshipRQ')
            		ico.addClass('glyphicon-user');
            }
	    };
	});
