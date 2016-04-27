angular.module("lf.post", [])
	.controller('postCtrl', function($scope, $filter, postRes, JSONutils) {
		$scope.pop = {
			title : 'Friends who likes It:',
			place: 'right',
			templateUrl : 'likersTemplate.html'
		};
		$scope.currentUploads = 0;
		$scope.doPost = false;
		$scope.edition = false;
		$scope.editable = false;
        var usrListener = $scope.$watch('user', function (usr) {
        	if (usr) {
        		if ($scope.post.user_id === usr.id) { $scope.editable = true; }
        		$scope.owner = $scope.resolveUsers([$scope.post.user_id]).pop();
        		$scope.likers = $scope.resolveUsers($scope.post.likes);
        		usrListener();
        	}
	    });
		
		$scope.updatePost = function(post) {
			if ($scope.currentUploads > 0)
				$scope.doPost = true;
			else
				$scope.edit(post);
		};
		
		$scope.deletePost = function(post) {
			postRes.remove({id: post.id}).$promise.then(
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

		var updatePost = function(post, params, action) {
			var args = {id: post.id};
			if (action) { args.action = action; }
			postRes.update(args, params).$promise.then(
				function(res) {
					var found = $filter('filter')($scope.items, {id: post.id}, true);
					if (found.length > 0) {
						angular.copy(res, found[0]);
					}
					$scope.likers = $scope.resolveUsers(res.likes);
					$scope.setLastUpdated(post);
					console.log('post updated: ' + JSON.stringify(res, JSONutils.escape, 4));
				},
				function(err) { console.log(err); });
		};
		
		$scope.edit = function(post) {
			updatePost(post, { title: $scope.post.title, text: $scope.post.text, photos: $scope.post.photos });
			$scope.edition = false;
		};
		
		$scope.likeIt = function(post) {
			updatePost(post, {}, 'like');
		};
	})
	.directive('richTextEditor', function() {
	    return {
            restrict : "E",
            replace: true,
            scope : {
            	disabled: "=",
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
                	$scope.$apply();
        	    });
        	    
                $scope.editor.on('load', function (e, data) {
        	    	$scope.editor.setValue($scope.content);
        	    	
            	    $scope.$watch('disabled', function (val) {
            	    	if ($scope.editor && $scope.editor.toolbar) {
            	    		switchEditor(!val);
            	    	}
                	});
            	});
        	    
                $scope.$watch('content', function (val) {
                	$scope.editor.setValue(val);
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
