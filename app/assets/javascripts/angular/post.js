angular.module("lf.post", [])
	.controller('postCtrl', function($scope, $filter, postRes) {
		$scope.id = $scope.post.id;
		$scope.title = $scope.post.title;
		$scope.text = $scope.post.text;
		$scope.photos = $scope.post.photos;
		
		$scope.currentUploads = 0;
		$scope.doPost = false;
		$scope.active = true;
	    $scope.$watch('doPost',
	        function (val) {
	    		if (val) {
	    			$scope.active = !val;
	    		}
	        }
		);
		
		$scope.edition = false;
		
		$scope.deletePost = function(post) {
			if ($scope.photos && $scope.photos.length === 0) { $scope.photos = undefined; }
			
			var post = postRes.delete({id: post.id});
			post.$promise.then(
					function(res) {
						var found = $filter('filter')($scope.items, {id: post.id}, true)[0];
						$scope.items.splice($scope.items.indexOf(found), 1);
					},
					function(err) { console.log(err); });
			
			
			
		};
		
		$scope.updatePost = function() {
			if ($scope.photos.length === 0) { $scope.photos = undefined; }
			
			var post = postRes.get({id: $scope.id});
			console.log(post);
			
			post.$update({title: $scope.title, text: $scope.text, photos: $scope.photos}).$promise.then(
				function(res) {
					
					//angular.copy(res, $scope.items[$scope.id]);

					console.log('post updated: ' + JSON.stringify(res, JSONutils.escape, 4));
				},
				function(err) { console.log(err); });
			$scope.clear();
		};
	})
	.directive('richTextEditor', function() {
	    return {
            restrict : "E",
            replace: true,
            scope : {
            	isActive: "=",
            	content: "="
            },
            template : '<textarea></textarea>',
            link : function($scope, $element, $attrs) {
            	
                textarea = $element.wysihtml5({		
                	toolbar: {
              	      'font-styles': false,
              	      'color': true,
              	      'emphasis': true,
              	      'blockquote': false,
              	      'lists': true,
              	      'html': false,
              	      'link': true,
              	      'image': false,
              	      'smallmodals': true
                	}
                });
                
                $scope.editor = textarea.data('wysihtml5').editor;
                
                var switchEditor = function (val) {
	    			if (val) {
	            		$scope.editor.toolbar.show();
	            		$scope.editor.composer.enable();
	    			}else {
	        			$scope.editor.toolbar.hide();
	        			$scope.editor.composer.disable();
	    			}
                };

                $scope.editor.on('change', function (e, data) {
                	$scope.content = $scope.editor.getValue();
        	    });
        	    
                $scope.editor.on('load', function (e, data) {
        	    	$scope.editor.setValue($scope.content);
            	});
        	    
                $scope.$watch('content', function (val) {
                	$scope.editor.setValue(val);
        	    });
        	    
        	    $scope.$watch('isActive', function (val) {
        	    	if ($scope.editor && $scope.editor.toolbar) {
        	    		switchEditor(val);
        	    	}
            	});
            }
	    };
	})
	.directive('galleryLink', function () {
	    return {
			restrict: 'A',
	        link: function ($scope, $element, $attrs) {
				$element.on('click', function(e) {
				    e.preventDefault();
				    var name = e.currentTarget.dataset['gallery'].substring(1);
					$(".blueimp-gallery").attr('id', name);
					console.log(name);
				});
	        }
	    };
	})
	.directive('cloudImage', function () {
	    return {
	        replace: true,
			restrict: 'E',
	        link: function ($scope, $element, $attrs) {
	        	var params = {};
	        	if ($attrs.width) { params.width = $attrs.width; }
	        	if ($attrs.height) { params.height = $attrs.height; }
	        	if ($attrs.crop) { params.crop = $attrs.crop; }
	        	var img = $.cloudinary.image($attrs.publicId, params);   	
	        	$element.replaceWith(img[0]);
	        }
	    };
	});
