define(function(require) {
	var Backbone = require('backbone');
	//var configureTokenHeader = require('base/TokenAuthorizationHeaderConfigurator');
	//var configureAuthorizationEvents = require('base/AuthorizationEventsConfigurator');

	var Collection = Backbone.Collection.extend({

		sync : function(method, object, options) {
			//configureTokenHeader(options);
			return Backbone.sync.apply(this, arguments);
		}

	});

	return Collection;
});