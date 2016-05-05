angular.module("lf.friends", [])
	.controller('friendsCtrl', function($scope, $filter, userRes, notifRes) {
		$scope.tabSelector = true;
		$scope.goBack = false;
		$scope.searchResults = [];
		
		$scope.frManager = function(frId, action) {
			if (action == 'unfriends')
				var req = userRes.remove({user_id: $scope.user.id, friendId: frId, action: action});
			else if (action == 'friends')
				var req = userRes.update({user_id: $scope.user.id, friendId: frId, action: action});
			
			req.$promise.then(
					function(res) {
						if (action == 'friends') {
							$scope.user.friends.push(res.id);
							$scope.friends.unshift(res);						
						}
						else {
							var found = $filter('filter')($scope.friends, {id: frId}, true);
							if (found.length > 0 && action == 'unfriends')
								$scope.friends.splice($scope.friends.indexOf(found[0]), 1);
						}
					});
		};

		$scope.updateFrReq = function(notif, state) {
			notifRes.update({user_id: $scope.user.id, id: notif.id}, {n_type_aux: state});
			$scope.frRequests.splice($scope.frRequests.indexOf(notif), 1);
			if (state == 'accepted')
				$scope.frManager(notif.from, 'friends');
		};
		
		$scope.sendFrReq = function(friend) {
			notifRes.save({user_id: $scope.user.id}, {to: friend.id});
		};
		
		$scope.toggleTab = function() {
			$scope.tabSelector = !$scope.tabSelector;
		};
		
		$scope.search = function(token) {
			userRes.query({searchToken: token, action: 'search'}).$promise.then(
					function(res) {
						$scope.goBack = true;
						console.log(res);
						$scope.searchResults = res;
					});
		};
		
		$scope.clearSearch = function() {
			$scope.goBack = false;
			$scope.searchToken = '';
			$scope.searchResults = $scope.friends;
		};
		
		var listener = $scope.$watch("friends", function (val) {
			if (val.length > 0) {
				$scope.searchResults = $scope.friends;
				listener();
			}
		});
		
	});
