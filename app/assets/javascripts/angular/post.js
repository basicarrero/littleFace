angular.module("lf.post", [])
	.directive('post', function() {
	    return {
            restrict : "E",
            transclude: true,
            replace: true,
            template: '<div><ng-transclude></ng-transclude></div>',
            link : function($scope, $element, $attrs ) {
    			$scope.toggleEdit = function() {
    				// TODO: change ui for edition
    			};
            }
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
              	      'blockquote': true,
              	      'lists': true,
              	      'html': false,
              	      'link': true,
              	      'image': false,
              	      'smallmodals': true
                	}
                });
                $scope.editor = textarea.data('wysihtml5').editor;
                
                $scope.editor.on('change', function (e, data) {
                	$scope.content = $scope.editor.getValue();
        	    });
        	    
        	    $scope.$watch('content', function (val) {
	    			if (val) {
	    				$scope.editor.setValue(val);
	    			}
            	});
        	    
        	    $scope.$watch('isActive', function (val) {
        	    	if ($scope.editor && $scope.editor.toolbar) {
    	    			if (val) {
    	        			$scope.editor.toolbar.hide();
    	        			$scope.editor.composer.disable();
    	    			}else {
    	            		$scope.editor.toolbar.show();
    	            		$scope.editor.composer.enable();
    	    			}
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
