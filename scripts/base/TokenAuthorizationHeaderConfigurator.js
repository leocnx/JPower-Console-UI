define(function(require) {

	var keycloak = require('keycloak-object/keycloak-instance');
	var configureTokenHeader = function(options) {
		options.headers = Object.assign(options.headers || {}, {
			Authorization : 'Bearer ' + keycloak.token
		});
	};

	return configureTokenHeader;
});