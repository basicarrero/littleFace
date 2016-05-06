angular.module("lf.paginator", [])
	.controller('timelineCtrl',['$scope', '$window', 'timelineRes', 'postRes', function($scope, $window, timelineRes, postRes) {
		var currentPath = $window.location.pathname == '/' ? '/page/home' : $window.location.pathname;
		if (/^\/page\/external\//.test(currentPath)){
			var pathParts = currentPath.split('/');
			$scope.externalUsr = parseInt(pathParts[pathParts.length - 1]);
			$scope.endPoint = postRes;
		}else {
			$scope.endPoint = timelineRes;
		}
	}])
	.controller('homeCtrl',['$scope', 'postRes', function($scope, postRes) {
		$scope.endPoint = postRes;
	}])
	.controller('paginatorCtrl',['$scope', '$window', '$document', '$filter', '$q', function($scope, $window, $document, $filter, $q) {
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
		
		var listener = $scope.$watch("user", function (usr) {
			if (usr) {
				$scope.target = $scope.externalUsr == undefined ? usr.id : $scope.externalUsr;
				$scope.endPoint.query({user_id: $scope.target, limit: $scope.pageSize}).$promise.then(onSuccess(), onErr());
				listener();
			}
		});
    	
    	var loadMore = function(n) {
    		var defered = $q.defer();
    		var lastLoaded = $scope.items.length > 0 ? $scope.items[$scope.items.length - 1] : undefined;
    		
    		var params = {user_id: $scope.target};
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
        			var res = $scope.endPoint.query({user_id: $scope.target, start: lastLoaded.id, limit: tailSize});
    				res.$promise.then(onSuccess(defered), onErr(defered));
    			}else 
    				$scope.isBusy = false;
    				return;
    		}else if (lastLoaded.id > id) {
    			var res = $scope.endPoint.query({user_id: $scope.target, begin: lastLoaded.id, end: id, tailSize: $scope.pageSize, action: 'range'});
				res.$promise.then(onSuccess(defered), onErr(defered));
    		}else {
				$scope.isBusy = false;
				return;
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
	}])
	.directive('linkHandler',['$window', '$timeout', '$animate', function ($window, $timeout, $animate) {
	    return {
			controller : function($scope, $document) {
		    	$scope.goTo = function(target) {
		    		return $document.scrollToElementAnimated(target, 130);
		    	};
			},
			link : function($scope, $element, $attr) {
				
		    	var go = function (id, after) {
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
	        	
				$element.on('click', function(e) {
					//if (e.stopPropagation) e.stopPropagation();
					if (e.preventDefault) e.preventDefault();
					var pathParts = $attr.href.split('#');
					var currentPath = $window.location.pathname == '/' ? '/page/home' : $window.location.pathname;
					if ((pathParts[0] == '') || (pathParts[0] == currentPath)) {
						if (pathParts.length == 2 && /^p-/.test(pathParts[1])) {
							var id = pathParts[1].split('-')[1];
							var promise = $scope.showUntil(id);
							if (promise)
								promise.then(go(id));
							else
								go(id);
						}
					}else {
						$window.location.href = pathParts[0] + '?go=' + pathParts[1];
					}
				});
				
		        if ($attr.goTo) {
	        		var id = $attr.goTo.split('-')[1];
	        		var listener = $scope.$watch("isBusy", function (val) {
	        			if (val === false) {
							var promise = $scope.showUntil(id);
							if (promise)
								promise.then(go(id, 2000));
							else
								go(id);
							listener();
	        			}
	        		});
	        	}
			}
	    };
	}])
	.directive('reveal',['$timeout', function ($timeout) {
	    return {
	        restrict: 'A',
	        scope: {time: "@"},
			link : function($scope, $element, $attr) {
				var t = $scope.time ? $scope.time : 0;
				$timeout(function(){ 
					$element.removeClass('hidden');
				}, t);
			}
	    };
	}]);
