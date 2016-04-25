angular.module("lf.modalNew", [])
	.controller('modalNewPostCtrl', function($scope, $document, postRes, JSONutils) {
		$scope.currentUploads = 0;
		$scope.doPost = false;
		$scope.active = true;
		$scope.text = '';
		$scope.title = '';
		$scope.photos = [];
		
	    $scope.$watch('doPost',
	        function (val) {
	    		if (val) {
	    			$scope.active = !val;
	    		}
	        }
		);
	    
		$scope.submitPost = function() {
			if ($scope.currentUploads > 0) {
				$scope.doPost = true;
			} else {
				$scope.send();
				$scope.clear();
				$scope.doPost = true;
			}
			$scope.dismiss();
		};
	
		$scope.send = function() {
			if ($scope.photos.length === 0) { $scope.photos = undefined; }
			postRes.save({title: $scope.title, text: $scope.text, photos: $scope.photos}).$promise.then(
				function(res) {
					$scope.$parent.items.unshift(res);
					$scope.setLastCreated(res);
					console.log('post saved: ' + JSON.stringify(res, JSONutils.escape, 4));
				},
				function(err) { console.log(err); });
			$scope.clear();
		};
		
		$scope.clear = function() {
			$scope.photos = [];
			$scope.title = '';
			$scope.text = '';
			$scope.clearFiles();
			$scope.postForm.$setPristine();
			$scope.doPost = false;
		};
	})
	.directive('modalActions', function () {
	    return {
	        restrict: 'A',
	        require: 'ngController',
			link : function($scope, $element, $attr) {
				$scope.dismiss = function() {
					$element.modal('toggle');
				};
				$scope.clearFiles = function() {
					$element.children().find("tbody").empty();
				};
			}
	    };
	});
