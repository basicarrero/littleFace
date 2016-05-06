angular.module("lf.admin", [])
	.controller('adminCtrl', ['$scope', 'userRes', 'postRes', 'JSONutils', function($scope, userRes, postRes, JSONutils) {
		$scope.output = [];
		
    	var err = function(err) {
			if ($scope.output.length > 0) $scope.output += '\n' + err.statusText;
			else $scope.output += err.statusText;
		};
		
    	var out = function(res) {
    		if (typeof res === 'string' || res instanceof String) {
    			if ($scope.output.length > 0) $scope.output += '\n' + res;
    			else $scope.output += res;    			
    		}
    		else if (res instanceof Array) {
    			angular.forEach(res.slice().reverse(), function(r) {
    				if ($scope.output.length > 0) $scope.output += '\n';
    				$scope.output += JSON.stringify(r, JSONutils.escape, 4);
    			});
    		}else {
				if ($scope.output.length > 0) $scope.output += '\n';
				$scope.output += JSON.stringify(res, JSONutils.escape, 4);
    		}
		};
		
    	$scope.execute = function(comm) {
    		$scope.commandline = '';
    		if (comm === 'clear') {
    			$scope.output = '';
    			return;
    		}
    		// Nasty command parser
    		var args = comm.substring(comm.indexOf(' ') + 1);
    		var action = comm.substring(0, comm.indexOf(' '));
    		if (action.length > 0) {
	    		switch(action) {
	    		    case 'get':
	    		    	if (/^users$/.test(args)){
	    		    		userRes.query().$promise.then(out, err);
	    		    		return;
	    		    	}
	    		    	if (/^user:[0-9]+$/.test(args)) {
	    		    		var usrId = parseInt(args.split(':')[1]);
	    		    		userRes.get({user_id: usrId}).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		    	if (/^user:[0-9]+\sposts$/.test(args)) {
	    		    		var usrId = parseInt(args.split(' ')[0].split(':')[1]);
	    		    		postRes.query({user_id: usrId}).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		    	if (/^user:[0-9]+\spost:[0-9]+$/.test(args)) {
	    		    		var usrId = parseInt(args.split(' ')[0].split(':')[1]);
	    		    		var postId = parseInt(args.split(' ')[1].split(':')[1]);
	    		    		postRes.get({user_id: usrId, id: postId}).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		        break;
	    		    case 'delete':
	    		    	if (/^user:[0-9]+$/.test(args)) {
	    		    		var usrId = parseInt(args.split(':')[1]);
	    		    		userRes.remove({user_id: usrId}).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		    	if (/^user:[0-9]+\spost:[0-9]+$/.test(args)) {
	    		    		var usrId = parseInt(args.split(' ')[0].split(':')[1]);
	    		    		var postId = parseInt(args.split(' ')[1].split(':')[1]);
	    		    		postRes.remove({user_id: usrId, id: postId}).$promise.then(out, err);
	    		    		return;
	    		    	}	    		    	
	    		        break;
	    		    case 'update':
	    		    	if (/^user:[0-9]+\s{.*}$/.test(args)) {
	    		    		var usrId = parseInt(args.split(':')[1]);
	    		    		var params = args.substring(args.indexOf('{'), args.indexOf('}') + 1);
	    		    		userRes.update({user_id: usrId, id: postId}, JSON.parse(params)).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		    	if (/^user:[0-9]+\spost:[0-9]+\s{.*}$/.test(args)) {
	    		    		var usrId = parseInt(args.split(' ')[0].split(':')[1]);
	    		    		var postId = parseInt(args.split(' ')[1].split(':')[1]);
	    		    		var params = args.substring(args.indexOf('{'), args.indexOf('}') + 1);
	    		    		postRes.update({user_id: usrId, id: postId}, JSON.parse(params)).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		        break;
	    		    case 'create':
	    		    	if (/^user\s{.*}$/.test(args)) {
	    		    		var params = args.substring(args.indexOf('{'), args.indexOf('}') + 1);
	    		    		userRes.save(JSON.parse(params)).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		    	if (/^user:[0-9]+\spost\s{.*}$/.test(args)) {
	    		    		var usrId = parseInt(args.split(' ')[0].split(':')[1]);
	    		    		var params = args.substring(args.indexOf('{'), args.indexOf('}') + 1);
	    		    		postRes.save({user_id: usrId}, JSON.parse(params)).$promise.then(out, err);
	    		    		return;
	    		    	}
	    		        break;
	    		}
    		} 
    		out('bad command');
    	};
	}])
	.directive('scrollDown',[ function () {
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
	}]);
