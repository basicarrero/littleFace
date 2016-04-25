angular.module("lf.post", [])
	.controller('postCtrl', function($scope, $filter, postRes, JSONutils) {
		$scope.id = $scope.post.id;
		$scope.userId = $scope.post.user_id;
		$scope.title = $scope.post.title;
		$scope.text = $scope.post.text;
		$scope.photos = $scope.post.photos;
		
		$scope.edition = false;
		$scope.editable = false;
        $scope.$watch('user', function (val) {
        	if (val && $scope.userId === val.id) {
        		$scope.editable = true;
        	}
	    });
        
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
		
		$scope.likeIt = function() {
			console.log('liked');
			// TODO: send notif
		};
		
		var cleanParams = function() {
			if ($scope.photos && $scope.photos.length === 0) { $scope.photos = undefined; }
			if ($scope.text && $scope.text === '') { $scope.text = undefined; }
		};
		
		$scope.deletePost = function(post) {
			cleanParams();
			var post = postRes.remove({id: post.id});
			post.$promise.then(
					function(res) {
						var found = $filter('filter')($scope.items, {id: post.id}, true);
						if (found.length > 0) {
							$scope.items.splice($scope.items.indexOf(found[0]), 1);
							$scope.showMore(1);
							$scope.setLastDeleted(post);
						}
					},
					function(err) { 
						console.log(err);
					});
		};
		
		$scope.updatePost = function() {
			cleanParams();
			var post = postRes.update({id: $scope.id}, { title: $scope.title, text: $scope.text, photos: $scope.photos });
			post.$promise.then(
				function(res) {
					var found = $filter('filter')($scope.items, {id: post.id}, true);
					if (found.length > 0) {
						angular.copy(res, found[0]);
					}
					$scope.setLastUpdated(post);
					console.log('post updated: ' + JSON.stringify(res, JSONutils.escape, 4));
				},
				function(err) { console.log(err); });
			$scope.edition = false;
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
                
//                var edBody = textarea.parent().find('iframe').contents().find('body');
//                edBody.on('keyup', function (e, data) {
//                	$scope.content = $scope.editor.getValue();
//                	$scope.$apply();
//        	    });
                
                $scope.editor.on('change', function (e, data) {
                	$scope.content = $scope.editor.getValue();
                	$scope.$apply();
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
