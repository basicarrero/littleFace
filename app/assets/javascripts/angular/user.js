angular.module("lf.user", [])
	.controller('userCtrl', function($scope, $filter, userRes, JSONutils) {
		var res = userRes.get({action: 'current'});
		res.$promise.then(
				function(res) {
					$scope.user = res.user;
					$scope.friends = res.friends;
					
					console.log(res);
				},
				function(err) { 
					console.log(err);
				});
		
	});
