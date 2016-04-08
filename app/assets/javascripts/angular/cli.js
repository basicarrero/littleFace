var ngCli = angular.module('angularCli', ['ngResource']);

myApp.directive('autoLoad', function ($window, $document) {
    return {
        restrict: 'E',
        link: function ($scope) {
            angular.element($window).bind('scroll', function () {
                //console.log('in scroll ' + (angular.element($document)[0].body.clientHeight - $window.innerHeight - 60) + ' - ' + $window.pageYOffset);
				// TODO: check if there are more post in controller first!
				if ($window.pageYOffset > angular.element($document)[0].body.clientHeight - $window.innerHeight - 60) {
                    $scope.showMore();
                }
				//$scope.$apply(); // scroll will run outside of the normal digest cycle, so we need to apply changes to scope
            });
        }
    };
});

ngCli.controller('paginator', function($scope, $document) {
	$scope.items = [];
	for(var i=1;i< 50;i++){
		$scope.items.push('item: ' + i);
	}
	
	$scope.showMore = function() {
		console.log("Go find more post!");
	};
	
	$scope.loadUntil = function(id) {
		// TODO
		for(var i=50;i< 120;i++){
			$scope.items.push('item: ' + i);
		}
	};
	
	$scope.goTo = function(target) {
		$document.scrollToElementAnimated(target);
	};
});

ngCli.directive('willScroll', function () {
    return {
        restrict: 'A',
		link : function($scope, $element, $attr) {
		  $element.on('click', function(e) {
		  
		  	if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();

			var id = $attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
			var target = document.getElementById(id);
			
			if(!target) {
				// Use promises here!
				$scope.loadUntil(id);
				target = document.getElementById(id);
			}
			
			if(!target || !target.getBoundingClientRect) return;
			$scope.goTo(target);
		  });
		}
    };
});
