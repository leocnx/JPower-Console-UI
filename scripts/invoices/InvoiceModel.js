define(function(require) {
	var BaseModel = require('base/PagedCollectionItem');

	var Invoice = BaseModel.extend({

		select : function() {
			this.collection.trigger('selected', this);
		}

	});

	return Invoice;
});
