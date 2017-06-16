define(function(require) {
	var Backbone = require('backbone');
	var template = require('text!invoices/invoices-list-item.template');

	var View = Backbone.View.extend({
		tagName : "tr",

		events : {
			"click #delete" : "destroy"
		},

		template : _.template(template),

		initialize : function() {
			this.listenTo(this.model, 'sync', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		destroy : function() {
			this.model.destroy();
		}

	});

	return View;
});
