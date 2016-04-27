angular.module("lf.user", [])
	.controller('userCtrl', function($scope, $filter, userRes) {
		userRes.get({action: 'current'}).$promise.then(
				function(res) {
					$scope.user = res.user;
					$scope.friends = res.friends;
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
	});
