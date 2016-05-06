angular.module("lf.resources", [])
	.factory('postRes',['$resource', function($resource) {
		return $resource('/user/:user_id/post/:id/:action.json', {},
			    {
		    		'update': { method:'PUT' }
			    });
	}])
	.factory('timelineRes',['$resource', function($resource) {
		return $resource('/user/:user_id/timeline.json');
	}])
	.factory('notifRes',['$resource', function($resource) {
		return $resource('/user/:user_id/notif/:id/:action.json', {},
				{
					'update': { method:'PUT' }
				});
	}])
	.factory('userRes',['$resource', function($resource) {
		return $resource('/user/:user_id/:action.json', {},
				{
					'update': { method:'PUT',
								params: { 
									user_id: "@user_id",
									friendId: "@friendId",
									action: "@action"
								}
					}
				});
	}])
	.filter('capitalize', function() {
	    return function(input) {
	      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	    };
	})
	.factory('JSONutils', function() {
		return {
			escape: function (key, val) {
					    if (typeof(val)!="string") return val;
					    return val
					      .replace(/[\"]/g, '\\"')
					      .replace(/[\\]/g, '\\\\')
					      .replace(/[\/]/g, '\\/')
					      .replace(/[\b]/g, '\\b')
					      .replace(/[\f]/g, '\\f')
					      .replace(/[\n]/g, '\\n')
					      .replace(/[\r]/g, '\\r')
					      .replace(/[\t]/g, '\\t')
					      ;
					}
		};
	});
