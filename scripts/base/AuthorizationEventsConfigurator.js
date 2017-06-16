define(function() {
	var configureAuthorizationEvents = function(options, object) {
		options.statusCode || (options.statusCode = {});

		Object.assign(options.statusCode, {
			401 : function() {
				object.trigger("unauthorized");
			},
			403 : function() {
				object.trigger("forbidden");
			}
		});
	};
	
	return configureAuthorizationEvents;
});