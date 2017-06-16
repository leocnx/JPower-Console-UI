define(function(require) {
	var Backbone = require('backbone');
	var template = require('text!menu/menu.template');
	//var keycloak = require('keycloak-object/keycloak-instance');

	var MenuView = Backbone.View.extend({
		
		events : {
			"click a:not(.dropdown-toggle)" : "onMenuClick"
		},
		
		render: function() {
			//this.$el.html(_.template(template)({keycloak: keycloak,realm:keycloak.realm}));
			this.$el.html(_.template(template)({}));
			this.updateSelection();
			this.$("li:not(:has(a[href]))").hide();
			return this;
		},
		
		updateSelection: function() {
			var selection = this.getSelection();
			this.setActive(selection);
			selection.parents('ul.submenu').toggleClass("show");	
		},
		
		getSelection: function() {
			return this.$("a[href='"+window.location.hash+"']");	
		},
		
		onMenuClick: function(event) {
		var event = window.event || arguments.callee.caller.arguments[0];
			this.setActive($(event.target));
		},
		
		setActive: function(element) {
			this.$(".active").removeClass("active");
			element.closest("li").addClass("active");
		}
		
	});
	return MenuView;
});