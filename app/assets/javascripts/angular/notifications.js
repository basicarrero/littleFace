angular.module("lf.notifications", [])
	.controller('notificationsCtrl', function($scope, notifRes) {
    	//$scope.maxItems = 8;
    	//$scope.items = notifRes.query({limit: $scope.maxItems});
		// TODO: use this https://angular-ui.github.io/bootstrap/#dropdown && http://getbootstrap.com/components/#badges
		$scope.pushNotif = function(notif) {
			console.log('TODO');
			console.log(notif);
			// TODO
		};
	});