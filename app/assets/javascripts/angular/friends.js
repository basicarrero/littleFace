angular.module("lf.friends", [])
	.controller('friendsCtrl', function($scope, $filter, userRes, notifRes) {

		$scope.tabSelector = true;
		$scope.searchResults = [];
		
		$scope.frManager = function(frId, action) {
			userRes.update({user_id: $scope.user.id, friendId: frId, action: action}).$promise.then(
					function(res) {
						var found = $filter('filter')($scope.friends, {id: frId}, true);
						if (found.length > 0 && action == 'unfriends')
								$scope.friends.splice($scope.friends.indexOf(found[0]), 1);
						else if (res.length > 0 && action == 'friends')
								$scope.friends.unshift(res);
					});
		};
		
		var refreshFrienshipRq = function() {
	    	$scope.notifs = notifRes.query({user_id: $scope.user.id, action: 'frRequests'}).$promise.then(
					function(res) {
						$scope.frRequests = res;
					});
		};
		
		$scope.updateFrReq = function(notifId, state) {
			notifRes.update({user_id: $scope.user.id, id: notifId}, {n_type_aux: state}).$promise.then(refreshFrienshipRq());
		};
		
		$scope.sendFrReq = function(friendId) {
			var newReq = {};
			newReq.from = $scope.user.id;
			newReq.n_type_aux = 'pending';
			// TODO: more params msg, link etc...
			notifRes.save({user_id: friendId}, newReq).$promise.then(refreshFrienshipRq());
		};
		
		$scope.toggleTab = function() {
			$scope.tabSelector = !$scope.tabSelector;
		};
		
		$scope.search = function(token) {
			userRes.query({searchToken: token, action: 'search'}).$promise.then(
					function(res) {
						console.log(res);
						$scope.searchResults = res;
					});
		};
		
		$scope.clearSearch = function(token) {
			$scope.searchResults = $scope.friends;
		};
		
		var listener = $scope.$watch("friends", function (val) {
			if (val.length > 0) {
				$scope.searchResults = $scope.friends;
				listener();
			}
		});
		
	});
