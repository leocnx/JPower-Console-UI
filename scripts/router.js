define(function(require) {
	var Backbone = require('backbone');

	var InvoicesView = require('./invoices/InvoicesView');
	var InvoicesCollection = require('./invoices/InvoicesCollection');

	var JPowerRouter = Backbone.Router.extend({

		execute : function(callback, args) {
			this.clean();
			if (callback) {
				callback.apply(this, args);
				this.doRender();
			}
		},

		views : new Map(),

		addView : function(selector, view) {
			var array = this.views.get(selector);
			if (!array) {
				array = [];
				this.views.set(selector, array);
			}
			if (view) {
				array.push(view);
			}
		},

		doRender : function() {
			this.views.forEach(function(views, selector) {
				var parent = $(selector);
				views.forEach(function(view) {
					if (view) {
						parent.append(view.render().el);
					}
				});
			});
		},

		clean : function() {
			this.views.forEach(function(views, selector) {
				$(selector).empty();
				views.forEach(function(view) {
					view.remove();
				});
			});
			this.views = new Map();
		},

		routes : {
			"" : "console",
			"console" : "console",
			"invoices" : "invoices"
		},

		invoices : function() {
			var invoices = new InvoicesCollection();
			this.addView('#main', new InvoicesView({
				model : invoices,
				viewConfig : {
					withCreate : false,
					withUpdate : false,
					withDelete : false,
					withSearch : true
				}
			}));
			invoices.data = {
				businessType : 'TRADE'
			};
			invoices.fetch({
				reset : true
			});
		},

	});

	return JPowerRouter;
});
