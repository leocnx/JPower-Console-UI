define(function(require) {
	var TokenSecuredCollection = require('base/TokenSecuredCollection');
	var Invoice = require('./InvoiceModel');

	var InvoicesList = TokenSecuredCollection.extend({
		model : Invoice,
		url : '/JPower-Console-UI/invoices.json',

		comparator : function(a, b) {
			if (b.id < a.id) {
				return -1;
			}
			return 1;
		},

		initialize : function() {
			TokenSecuredCollection.prototype.initialize.apply(this, arguments);
			this.urlQueryParameterContributors.push(this.addSearchParameters
					.bind(this));
		},

		addSearchParameters : function(options) {
			var dataParam = this.getDataNode(options);
			var dataSpec = this.data || {};
			Object.assign(dataParam, dataSpec);
		}
	});

	return InvoicesList;
});