angular.module("lf.resources", [])
	.factory('postRes', function($resource) {
		return $resource('/post/:action.json');
	})
	.factory('notifRes', function($resource) {
		return $resource('/notif.json');
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
