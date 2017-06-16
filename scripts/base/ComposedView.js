define(function(require) {
	var Backbone = require('backbone');

	var ComposedView = Backbone.View.extend({

		initialize : function() {
			this.subviews = new Array(0);
		},
		
		registerSubView : function(view) {
			this.subviews.push(view);
			return view;
		},

		removeSubviews : function() {
			var subview;
			while (subview = this.subviews.pop()) {
				subview.remove();
			}
		},

		remove : function() {
			this.removeSubviews();
			Backbone.View.prototype.remove.apply(this);
		}
	});
	
	return ComposedView;
});