define(function(require) {
	var Backbone = require('backbone');
	var PagedCollection = require('base/PagedCollection');
	//var configureTokenHeader = require('base/TokenAuthorizationHeaderConfigurator');
	//var configureAuthorizationEvents = require('base/AuthorizationEventsConfigurator');

	var TokenSecuredCollection = PagedCollection.extend({

		initialize : function() {
			PagedCollection.prototype.initialize.apply(this, arguments);
		},

		sync : function(method, object, options) {
			//configureTokenHeader(options);
			return Backbone.sync.apply(this, arguments);
		}

	});

	return TokenSecuredCollection;
});