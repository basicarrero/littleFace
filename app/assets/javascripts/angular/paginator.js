angular.module("lf.paginator", [])
	.controller('timelineCtrl', function($scope, timelineRes) {
		$scope.endPoint = timelineRes;
	})
	.controller('homeCtrl', function($scope, postRes) {
		$scope.endPoint = postRes;
	})
	.controller('paginatorCtrl', function($scope, $window, $document, $filter, $q) {
    	$scope.pageSize = 8;
    	$scope.items = [];
    	$scope.isBusy = true;
    	$scope.areMore = true;
    	
    	var onSuccess = function(defered) {
    		// success function
    		return function(res) {
    			angular.forEach(res, function(r) { $scope.items.push(r); });
    			$scope.isBusy = false;
    			if (res.length == 0) {
    				console.log('No more!');
    				$scope.areMore = false;
    			}
    			if (defered) { defered.resolve(res); }
    		};
		};
		
    	var onErr = function(defered) {
    		// error function
    		return function(err) {
    			console.log(err);
    			$scope.isBusy = false;
    			if (defered) { defered.reject(err); }
    		};
		};
		
    	var res = $scope.endPoint.query({limit: $scope.pageSize});
    	res.$promise.then(onSuccess(), onErr());
    	
    	var loadMore = function(n) {
    		var defered = $q.defer();
    		var lastLoaded = $scope.items.length > 0 ? $scope.items[$scope.items.length - 1] : undefined;
    		
    		var params = {};
    		if (lastLoaded)
    			params.start = lastLoaded.id;
    		
    		if (n)
    			params.limit = n;
    		else
    			params.limit = $scope.pageSize;
    		
    		var res = $scope.endPoint.query(params);
			res.$promise.then(onSuccess(defered), onErr(defered));
    		return defered.promise;
    	};
    	
    	var loadUntil = function(id) {
    		var defered = $q.defer();
    		var lastLoaded = $scope.items.length > 0 ? $scope.items[$scope.items.length - 1] : undefined;
    		
    		var found = $filter('filter')($scope.items, {id: id}, true);
    		var tailSize;
    		if (found.length > 0) {
    			var pos = $scope.items.indexOf(found[0]);
    			tailSize = (($scope.items.length - 1 ) - pos );
    			if (tailSize < $scope.pageSize) {
        			var res = $scope.endPoint.query({start: lastLoaded.id, limit: tailSize});
    				res.$promise.then(onSuccess(defered), onErr(defered));
    			}else 
    				$scope.isBusy = false;
    				return;
    		}else {
    			var res = $scope.endPoint.query({begin: lastLoaded.id, end: id, tailSize: $scope.pageSize, action: 'range'});
				res.$promise.then(onSuccess(defered), onErr(defered));
    		}
    		return defered.promise;
    	};
    	
    	$scope.showMore = function(id) {
    		if (!$scope.isBusy && $scope.areMore) {
    			$scope.isBusy = true;
    			return loadMore(id);
    		}
    	};
    	
    	$scope.showUntil = function(id) {
    		if (!$scope.isBusy && $scope.areMore) {
    			$scope.isBusy = true;
    			return loadUntil(id);
    		}
    	};
    	
    	$scope.setLastCreated = function(p) {
    		$scope.lastCreated = p;
    	};
    	
    	$scope.setLastUpdated = function(p) {
    		$scope.lastUpdated = p;
    	};
    	
    	$scope.setLastDeleted = function(p) {
    		$scope.lastDeleted = p;
    	};
    	
    	angular.element($window).bind('scroll', function () {
            //console.log('in scroll ' + (angular.element($document)[0].body.clientHeight - $window.innerHeight - 60) + ' - ' + $window.pageYOffset);
			if ($window.pageYOffset > angular.element($document)[0].body.clientHeight - $window.innerHeight - 60) {
                $scope.showMore();
            }
			//$scope.$apply(); // scroll will run outside of the normal digest cycle, so we need to apply changes to scope
        });
	})
	.directive('scroller', function ($timeout, $animate) {
	    return {
			controller : function($scope, $document) {
		    	$scope.goTo = function(target) {
		    		return $document.scrollToElementAnimated(target, 130);
		    	};
			},
			link : function($scope, $element, $attr) {
		    	$scope.go = function (id, after) {
		    		var t = after ? after : 500;
					$timeout(function () { // Do after render
						var target = document.getElementById('p-' + id);
						if (target) { 
							$scope.goTo(target).then(function(res) {
								$animate.addClass(target, 'pulse').then(function() {
									$timeout(function(){ 
										$animate.removeClass(target, 'pulse'); 
									}, 2000);
							    });
							});
						}
					}, t);
	        	};
	        	if ($attr.goTo) {
	        		var id = $attr.goTo.split('-')[1];
	        		var listener = $scope.$watch("isBusy", function (val) {
	        			if (val === false) {
							var promise = $scope.showUntil(id);
							if (promise)
								promise.then($scope.go(id, 2500));
							else
								$scope.go(id);
							listener();
	        			}
	        		});
	        	}
			}
	    };
	})
	.directive('willScroll', function ($timeout, $animate) {
	    return {
	        restrict: 'A',
			link : function($scope, $element, $attr) {
				$element.on('click', function(e) {
					if (e.stopPropagation) e.stopPropagation();
					if (e.preventDefault) e.preventDefault();
					var id = parseInt($attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1).split('-')[1]);
					var promise = $scope.showUntil(id);
					if (promise)
						promise.then($scope.go(id));
					else
						$scope.go(id);
				});
			}
	    };
	})
	.directive('reveal', function () {
	    return {
	        restrict: 'A',
			link : function($scope, $element, $attr) {
				$element.removeClass('hidden');
			}
	    };
	});
