define(function(require) {
	var Backbone = require('backbone');

	var BaseModel = Backbone.Model.extend({

		get : function(referenceName, targetClass) {
			var target = Backbone.Model.prototype.get.apply(this, [ referenceName ]);
			if (target == null) {
				return null;
			}
			if (targetClass == null) {
				return target;
			}
			if (target.__proto__ === targetClass.prototype) {
				return target;
			}
			if (Array.isArray(target)) {
				var element, newArray = [];
				while (element = target.pop()) {
					newArray.push(element.__proto__ == targetClass.prototype.model ? element : new targetClass.prototype.model(element))
				}
				target = newArray;
			}
			target = new targetClass(target);
			this.set(referenceName, target);
			return target;
		},

		select : function() {
			this.collection.trigger('selected', this);
		}

	});

	return BaseModel;
});