angular.module("lf.post", [])
	.controller('postCtrl', function($scope, $filter, $q, postRes, JSONutils) {
		$scope.pop = {
			title : 'Friends who likes It:',
			place: 'right',
			templateUrl : 'likersTemplate.html'
		};
		// join url and public id of the picture for rendering
		var getThumbs = function() {
			var thumbnails = [];
			if ($scope.post.resources && $scope.post.resources.length == $scope.post.photos.length) {
				for (i=0; i<$scope.post.photos.length; i++)
					thumbnails.push({url: $scope.post.resources[i], public_id: $scope.post.photos[i]});
			}
			return thumbnails;
		};

		$scope.thumbnails = getThumbs();
		$scope.currentUploads = 0;
		$scope.resetUploader = false;
		$scope.doPost = false;
		$scope.edition = false;
		$scope.editable = false;
		// set vars dependent on user data
        var usrListener = $scope.$watch('user', function (usr) {
        	if (usr) {
        		if ($scope.post.user_id === usr.id) { $scope.editable = true; }
        		$scope.owner = $scope.resolveUsers([$scope.post.user_id]).pop();
        		$scope.likers = $scope.resolveUsers($scope.post.likes);
        		usrListener();
        	}
	    });
		// Init edition
		$scope.initEdit = function() {
			$scope.newTitle = $scope.post.title;
			$scope.newText = $scope.post.text;
			$scope.newPhotos = [];
			$scope.newUploaded = [];
			$scope.newDeleteTokens = [];
			angular.copy($scope.post.photos, $scope.newPhotos);
			$scope.edition = true;
			$scope.forDeletionAux = [];
		};
        // Toggles an existent photo in the new photo set
		$scope.forDeletionToggle = function(id) {
			if ($scope.forDeletionAux.indexOf(id) < 0) {
				$scope.forDeletionAux.push(id);
				$scope.newPhotos.splice($scope.newPhotos.indexOf(id), 1);
			}else {
				$scope.newPhotos.push(id);
				$scope.forDeletionAux.splice($scope.forDeletionAux.indexOf(id), 1);
			}
		};
		// Edit if no current active downloads, set a flag to delegate the task to the fileUploader
		$scope.updatePost = function(post) {
			if ($scope.currentUploads > 0)
				$scope.doPost = !$scope.doPost;
			else
				$scope.edit(post);
		};
		// Perform the update
		var update = function(post, params, action) {
			var defered = $q.defer();
			var args = {user_id: $scope.user.id, id: post.id};
			if (action) { args.action = action; }
			postRes.update(args, params).$promise.then(
				function(res) {
					$scope.resetUploader = true;
					var found = $filter('filter')($scope.items, {id: post.id}, true);
					if (found.length > 0) {
						angular.copy(res, found[0]);
					}
					$scope.likers = $scope.resolveUsers(res.likes);
					$scope.thumbnails = getThumbs();
					$scope.setLastUpdated(post);
					console.log('post updated: ' + JSON.stringify(res, JSONutils.escape, 4));
					defered.resolve(res);
				},
				function(err) { 
					console.log(err);
					defered.reject(err);
				}
			);
			return defered.promise;
		};
		// Delete a post
		$scope.deletePost = function(post) {
			postRes.remove({user_id: $scope.user.id, id: post.id}).$promise.then(
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
		// Build params and call update
		$scope.edit = function(post) {
			var updateParams = {};
			if ($scope.newTitle.length > 0) updateParams.title = $scope.newTitle;
			updateParams.text = $scope.newText;
			var allPhotos = $scope.newPhotos.concat($scope.newUploaded);
			updateParams.photos = allPhotos.length > 0 ? allPhotos : 0;
			$scope.edition = false;
			$scope.doPost = false;
			update(post, updateParams);
		};
		// Update likes
		$scope.likeIt = function(post) {
			update(post, {}, 'like');
		};
		// Share post
		$scope.share = function(post) {
			update(post, {}, 'share');
		};
		// Delete uploaded images if go back without saving
		$scope.back = function() {
			$scope.edition = false;
			$scope.resetUploader = true;
			angular.forEach($scope.newDeleteTokens, function(token) {
				$.cloudinary.delete_by_token(token);
				console.log('removed photo: ' + token);
			});
		};
	})
	.directive('richTextEditor', function() {
	    return {
            restrict : "E",
            replace: true,
            scope : {
            	editorDisabled: "=",
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
        	    	
            	    $scope.$watch('editorDisabled', function (val) {
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
