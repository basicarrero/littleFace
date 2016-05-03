angular.module("lf.accordion", [])
	.controller('accordionCtrl', function($scope, $q, $timeout, postRes) {
		$scope.data = [{label:'December', posts: []},
		               {label:'November', posts: []},
		               {label:'October', posts: []},
		               {label:'September', posts: []},
		               {label:'August', posts: []},
		               {label:'July', posts: []},
		               {label:'June', posts: []},
		               {label:'May', posts: []},
		               {label:'April', posts: []},
		               {label:'March', posts: []},
		               {label:'February', posts: []},
		               {label:'January', posts: []}];
		
		var listener = $scope.$watch("user", function (usr) {
			if (usr) {
				postRes.query({user_id: $scope.user.id, action: 'recent'}).$promise.then(
						function(res) {
							for (j=0; j<$scope.data.length; j++) {
								angular.copy(res[$scope.data.length - 1 - j], $scope.data[j]['posts']);
							}
							// Toggle first panel with posts
							$timeout(function () {
								for (var i = 0, len = $scope.accordion.groups.length; i < len; i++) {
									var psc = $scope.accordion.groups[i].$parent;
									if (psc.month.posts.length > 0) {
										psc.open = true;
										break;
									}
								}
							}, 1);
					});
				listener();
			}
		});
		
	    $scope.$watch('lastCreated',
	        function (post) {
	    		if (post) {
	    			var idx = $scope.data.length - 1 - new Date(post.created_at).getMonth();
	    			$scope.data[idx].posts.unshift({id: post.id, title: post.title});
	    		}
	        }
	    );
	    
	    $scope.$watch('lastUpdated',
	        function (post) {
	    		if (post) {
	    			var idx = $scope.data.length - 1 - new Date(post.created_at).getMonth();
	    			angular.forEach($scope.data[idx].posts, function(p) {
	    				if (post.id === p.id) {
	    					p.title = post.title;
	    				}
	    			});
	    		}
	        }
	    );
	    
	    $scope.$watch('lastDeleted',
	        function (post) {
	    		if (post) {
	    			var idx = $scope.data.length - 1 - new Date(post.created_at).getMonth();
	    			angular.forEach($scope.data[idx].posts, function(p) {
	    				if (post.id === p.id) {
	    					$scope.data[idx].posts.splice($scope.data[idx].posts.indexOf(p), 1);
	    				}
	    			});
	    		}
	        }
	    );
	    
		$scope.isDisabled = function(month) {
			if (month.posts && month.posts.length > 0) { return false; }
			else { return true; }
		};
	});
