angular.module("lf.resources", [])
	.factory('postRes', function($resource) {
		return $resource('/post/:id/:action.json', {id: "@id"},
			    {
		    		'update': { method:'PUT' }
			    });
	})
	.factory('notifRes', function($resource) {
		return $resource('/notif.json');
	})
	.factory('timelineRes', function($resource) {
		return $resource('/timeline.json');
	})
	.factory('userRes', function($resource) {
		return $resource('/user.json');
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
