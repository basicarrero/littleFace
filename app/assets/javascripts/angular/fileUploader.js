angular.module("lf.fileUploader", [])
	.directive('fileUploader', function () {
	    return {
	    	scope: {
	    		uploads: "=",
	    		files: "=",
	    		resetFlag: "=",
	    		deleteTokens: "=",
	    		doCallback: "=",
	    		callback: "&",
	    		id: "@"
	    	},
            controller: function($scope, $document) {
            	$scope.rows = [];
        	},
			link : function($scope, $element, $attr) {
				var input = angular.element($element.children().find("input"));
				
				input.bind('fileuploadadd', function (e, data) {
    	    		$scope.uploads += 1;
    	    		$scope.$apply();
    	    		console.log('New upload added.');
        	    });
				input.bind('fileuploaddone', function (e, data) {
    	    		$scope.uploads -= 1;
    	    		$scope.$apply();
        	    });
				input.bind('fileuploadfail', function (e, data) {
    	    		$scope.uploads -= 1;
    	    		$scope.$apply();
        	    });
				input.bind('cloudinarydone', function (e, data) {
    	        	if (data.jqXHR.status === 200) {
    	        		$scope.files.push(data.result.public_id);
    	        		if ($scope.deleteTokens)
    	        			$scope.deleteTokens.push(data.result.delete_token);
    	        		console.log('Upload ' + data.id.toString() + ' succeed.');
    	        		if ($scope.uploads === 0 && $scope.doCallback) { $scope.callback(); }
    	        	}
        	    });
        		$scope.$watch("resetFlag", function (val) {
        			if (val === true) {
        				angular.forEach($scope.rows, function(row) {
        					row.remove();
        				});
        				$scope.resetFlag = false;
        			}
        		});
        		var tbody = angular.element($element.children().find("tbody"));
        		$scope.$watch("doCallback", function (val) {
        			if (val === true)
        				tbody.find("button").attr('disabled', 'disabled');
        			else
        				tbody.find("button").removeAttr('disabled');
        		});
        	    // jQuery needed!
				var fileUploads = 0;

				var FormatFileSize = function FormatFileSize(bytes) {
				    if (typeof bytes !== 'number') {
				        return '';
				    }
				    if (bytes >= 1000000000) {
				        return (bytes / 1000000000).toFixed(2) + ' GB';
				    }
				    if (bytes >= 1000000) {
				        return (bytes / 1000000).toFixed(2) + ' MB';
				    }
				    return (bytes / 1000).toFixed(2) + ' KB';
				};
				
				var fadeAway = function fadeAway(row) {
					row.removeClass('in');
					window.setTimeout(function () {
						row.remove();
					}, 200);
				};
				
				input.cloudinary_fileupload({
					autoUpload: false,
				    disableImageResize: false,
				    imageMaxWidth: 800,
				    imageMaxHeight: 600,
				    maxFileSize: 10000000 // 10 MB
				});
				
				input.bind('fileuploadadd', function (e, data) {
					data.process();
				});
				
				input.bind('fileuploadprocessalways', function (e, data) {
					data.id = fileUploads;
					data.scope = $scope.id;
					data.context = $('#files-' + $scope.id.split('-')[1]);
					data.submit();
				    $.each(data.files, function (i, file) {
				    	var node = $('<tr/>').addClass('fade in upload-' + fileUploads);
				    	
				    	if (file.preview) {
				        	node.append($('<td/>').attr('style', 'text-align: right').append(file.preview));
				       	}
				        node.append($('<td/>').append($('<span/>').text(file.name)));
				        
				        btn = $('<button/>').addClass('btn btn-danger btn-filelist');
				       	btn.append('<i class="glyphicon glyphicon-ban-circle"></i>');
				        
				        if (file.error) {
				       		node.append($('<td/>').append($('<span class="error text-danger"/>').text(file.error)));
				       		
				       		btn.click(function (e) {
				       			fadeAway($('#upload-' + data.id.toString()));
						    	return false;
						    });
				       	} else {
				       		col = $('<td/>').append($('<p/>').text('Uploading...'));
				        	col.append('<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-bar progress-bar-info" style="width:0%;"></div></div>');
				        	node.append(col);
				        	
				        	btn.click(function (e) {
				        		e.preventDefault();
						    	if (data.progress()['loaded'] < data.progress()['total']) {
						    		data.jqXHR.abort();  
						       	 	console.log('Upload ' + data.id.toString() + ' canceled.');
						       	 	fadeAway($('.upload-' + data.id.toString()));
						    	}
						    });
				       	}
				       	node.append($('<td/>').append(btn));
						node.prependTo(data.context);
						// Track row
						$scope.rows.push(node);
					});
				    fileUploads++;
				});
				
				input.bind('fileuploadprogress', function (e, data) {
				    if (e.isDefaultPrevented()) {
				        return false;
				    }
				    var progress = Math.floor(data.loaded / data.total * 100);
				   	if (data.context) {
				   		$('.upload-' + data.id.toString()).find('.progress')
				            .attr('aria-valuenow', progress)
				            .children().first().css(
				                'width',
				                progress + '%'
				            );
				    }
				});
				
				input.bind('cloudinarydone', function (e, data) {
					row = $('.upload-' + data.id.toString());
					btn = row.find('.btn-filelist');
					btn.removeClass('btn-danger');
					btn.addClass('btn-default');
					btn.children().first().removeClass('glyphicon-ban-circle');
					statusField = row.find('.progress').parent();
					statusField.empty();
					errors = false;
					$.each(data.result.files, function (i, file) { if (file.error) { errors = true; }});
					if (!errors){
						statusField.append('<i class="text-success glyphicon glyphicon-ok"></i>');
						btn.children().first().addClass('glyphicon-trash');
				    	btn.click(function (e) {
				    		e.preventDefault();
					    	if (data.result.delete_token) {
					    		$.cloudinary.delete_by_token(data.result.delete_token);
					    		fadeAway($('.upload-' + data.id.toString()));
					       	 	console.log('Upload ' + data.id.toString() + ' deleted.');
					    	}
					    	return false;
					    });
					} else {
						statusField.append('<i class="text-danger glyphicon glyphicon-remove"></i>');
						btn.children().first().addClass('glyphicon-alert');
					}
				});
			}
	    };
	});
