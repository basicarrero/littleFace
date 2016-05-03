angular.module("lf.resources", [])
	.factory('postRes', function($resource) {
		return $resource('/user/:user_id/post/:id/:action.json', {},
			    {
		    		'update': { method:'PUT' }
			    });
	})
	.factory('timelineRes', function($resource) {
		return $resource('/user/:user_id/timeline.json');
	})
	.factory('notifRes', function($resource) {
		return $resource('/user/:user_id/notif/:id/:action.json', {},
				{
					'update': { method:'PUT' }
				});
	})
	.factory('userRes', function($resource) {
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
