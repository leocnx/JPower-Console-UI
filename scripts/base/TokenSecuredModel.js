define(function(require) {
	var BaseModel = require('base/BaseModel');
	// var configureTokenHeader = require('base/TokenAuthorizationHeaderConfigurator');

	var TokenSecuredModel = BaseModel.extend({

		sync : function(method, object, options) {
			// configureTokenHeader(options);
			return Backbone.sync.apply(this, arguments);
		}

	});

	return TokenSecuredModel;
});