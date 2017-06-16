define(function(require) {
	var Backbone = require('backbone');

	var FacetedCollection = Backbone.Collection.extend({
		initialize : function() {
			this.urlQueryParameterContributors = [];
		},

		fetch : function() {
			var options = arguments[0] || {};
			this.urlQueryParameterContributors.forEach(function(contributor) {
				contributor(options);
			});
			Backbone.Collection.prototype.fetch.apply(this, [ options ]);
		},

		getDataNode : function(options) {
			var data = options.data;
			if (typeof data === 'undefined') {
				data = {};
				options.data = data;
			}
			return data;
		}
	});

	return FacetedCollection;
});