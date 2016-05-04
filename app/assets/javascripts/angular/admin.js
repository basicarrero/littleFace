angular.module("lf.admin", [])
	.controller('adminCtrl', function($scope, userRes, postRes) {
		$scope.output = [];
    	var err = function(err) {
			$scope.output += '\n' + err.statusText;
		};
		
    	var out = function(res) {
			$scope.output += '\n' + res;
		};
		
    	$scope.execute = function(comm) {
    		var commParts = comm.split(' ');
    		if (commParts.length > 0) {
	    		switch(commParts[0]) {
	    		    case 'get':
	    		    	switch(commParts.length) {
			    		    case 2:
			    		    	if (/^users$/.test(commParts[1])){
			    		    		userRes.query().$promise.then(out, err);
			    		    		return;
			    		    	}
			    		    	if (/^user:[0-9]+$/.test(commParts[1])) {
			    		    		var usrId = parseInt(commParts[1].split(':')[1]);
			    		    		userRes.get({user_id: usrId}).$promise.then(out, err);
			    		    		return;
			    		    	}
			    		        break;
			    		    case 3:
			    		    	if (/^user:[0-9]+$/.test(commParts[1]) && /^posts$/.test(commParts[2])) {
			    		    		var usrId = parseInt(commParts[1].split(':')[1]);
			    		    		postRes.query({user_id: usrId}).$promise.then(out, err);
			    		    		return;
			    		    	}
			    		    	if (/^user:[0-9]+$/.test(commParts[1]) && /^post:[0-9]+$/.test(commParts[2])) {
			    		    		var usrId = parseInt(commParts[1].split(':')[1]);
			    		    		var postId = parseInt(commParts[2].split(':')[1]);
			    		    		postRes.query({user_id: usrId, id: postId}).$promise.then(out, err);
			    		    		return;
			    		    	}
			    		        break;
	    	    		}
	    		        break;
	    		    case 'delete':
	    		        //code block
	    		        break;
	    		    case 'update':
	    		        //code block
	    		        break;
	    		    case 'create':
	    		        //code block
	    		        break;
	    		}
    		} 
    		$scope.output += '\nbad command';
    	};
	})
	.directive('scrollDown', function () {
	    return {
	        restrict: 'A',
			link : function($scope, $element, $attr) {
			    $scope.$watch('output',
				        function () {
			    			$element[0].scrollTop = $element[0].scrollHeight;
				        }
				    );
			}
	    };
	});
