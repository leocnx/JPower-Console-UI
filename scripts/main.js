define(function(require) {
	if (typeof Object.assign !== 'function') {
		Object.assign = function(target) {
			'use strict';
			if (target == null) {
				throw new TypeError(
						'Cannot convert undefined or null to object');
			}
			target = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source != null) {
					for ( var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}
			}
			return target;
		};
	}
	var $ = require('jquery');
	var Backbone = require('backbone');
	var ApplicationRouter = require('router')
	var Menu = require('menu/MenuView');
	// var UserInfoView = require('login/UserInfoView');
	fetch = Backbone.Collection.prototype.fetch;
	Backbone.Collection.prototype.fetch = function(options) {
		var self = this, opts = {
			error : function(collection, res) {
				self.trigger('fetch.error');
				if (options && options.error) {
					options.error(arguments);
					return;
				}
				if (res.status === 401) {
					location.reload()
				}
			}
		};
		(_.bind(fetch, this, _.extend({}, options, opts)))();
	};
	new Menu({
		el : $('#menu')
	}).render();
	// new UserInfoView({el: $('.console-account')}).render();
	$(function() {
		var router = new ApplicationRouter;
		Backbone.history.start();
	});
});
