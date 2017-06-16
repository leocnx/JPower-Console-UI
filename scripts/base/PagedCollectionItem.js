define(function(require) {
	var TokenSecuredModel = require('base/TokenSecuredModel');

	var PagedCollectionItem = TokenSecuredModel.extend({
		urlRoot : function() {
			return this.collection.baseUrl;
		}
	});

	return PagedCollectionItem;
});