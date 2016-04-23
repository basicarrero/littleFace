angular.module("lf.paginator", [])
	.controller('paginatorCtrl', function($scope, $window, $document, $filter, $q, postRes) {
    	$scope.pageSize = 10;
    	$scope.items = postRes.query({limit: $scope.pageSize});
    	$scope.isBusy = false;
    	$scope.areMore = undefined;
    	
        $scope.$watch(
            function () {
            	return $scope.items[$scope.items.length - 1];
            },
            function (newVal, oldVal) {
            	if (newVal) {
                    if (newVal.id === 1) { $scope.areMore = false; }
                    else { $scope.areMore = true; }
            	}
            }
        );
    	var loadUntil = function(id) {
    		var defered = $q.defer(); 
    		var lastLoaded = $scope.items.length > 0 ? $scope.items[$scope.items.length - 1] : {id: 1};
    		var found = $filter('filter')($scope.items, {id: id}, true);
    		var tailSize;
    		if (found.length > 0) {
    			var pos = $scope.items.indexOf(found[0]);
    			tailSize = (($scope.items.length - 1 ) - pos );
    			tailSize = tailSize < 0 ? 0 : tailSize;
    		}
    		if (!tailSize || tailSize < $scope.pageSize) {
    			var begin = lastLoaded.id - 1;
    			var end = (id - $scope.pageSize - 1) < 1 ? 1 : (id - $scope.pageSize);
    			if (begin >= end) {
    				$scope.isBusy = true;
    				//console.log('get from: ' + begin + ' to ' + end);
    				var res = postRes.query({begin: begin, end: end, action: 'range'});
    				res.$promise.then(
    					function(res) {	// success function
    						angular.forEach(res, function(r) { $scope.items.push(r); });
    						$scope.isBusy = false;
    						defered.resolve(res);
    					},
    					function(err) {	// error function
    						console.log(err);
    						$scope.isBusy = false;
    						defered.reject(err);
    					});
    				return defered.promise;
    			}
    		}
    	};
    	
    	$scope.showMore = function(id) {
    		if (!$scope.isBusy && $scope.areMore) {
    			if (id) {
    				return loadUntil(id);
    			} else {
    				return loadUntil($scope.items[$scope.items.length - 1].id);
    			}
    		}
    	};
    	
    	$scope.goTo = function(target) {
    		return $document.scrollToElementAnimated(target, 130);
    	};
    	
    	angular.element($window).bind('scroll', function () {
            //console.log('in scroll ' + (angular.element($document)[0].body.clientHeight - $window.innerHeight - 60) + ' - ' + $window.pageYOffset);
			if ($window.pageYOffset > angular.element($document)[0].body.clientHeight - $window.innerHeight - 60) {
                $scope.showMore();
            }
			//$scope.$apply(); // scroll will run outside of the normal digest cycle, so we need to apply changes to scope
        });
	})
	.directive('willScroll', function ($timeout, $animate) {
	    return {
	        restrict: 'A',
			link : function($scope, $element, $attr) {
	        	function go(id) {
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
	        	};
				$element.on('click', function(e) {
					console.log($scope.items[0]);
					if (e.stopPropagation) e.stopPropagation();
					if (e.preventDefault) e.preventDefault();
					var id = parseInt($attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1).split('-')[1]);
					var promise = $scope.showMore(id);
					if (promise) {
						promise.then(function() {
							$timeout(function () { go(id); }, 500);
				        });
					} else { go(id); }
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
