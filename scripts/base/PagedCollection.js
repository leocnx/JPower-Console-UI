define(function(require) {
	var Backbone = require('backbone');
	var FacetedCollection = require('base/FacetedCollection');

	var PagedCollection = FacetedCollection.extend({

		initialize : function() {
			FacetedCollection.prototype.initialize.apply(this, arguments);
			this.listenTo(this, 'destroy', this.decrementTotalSize);
			this.urlQueryParameterContributors.push(this.addPaginationToURL.bind(this));
		},

		incrementTotalSize : function() {
			this.changeSize(1);
		},

		decrementTotalSize : function() {
			this.changeSize(-1);
		},

		changeSize : function(i) {
			this.totalNumberOfResults += i;
			this.trigger('change:totalSize');
		},

		resetPagination : function() {
			delete this.pageNumber;
			delete this.pageSize;
		},

		addPaginationToURL : function(options) {
			var data = this.getDataNode(options);
			if (this.pageNumber) {
				data.pageNumber = this.pageNumber;
			}
			if (this.pageSize) {
				data.pageSize = this.pageSize;
			}

		},

		parse : function(response) {
			this.totalNumberOfResults = response.totalNumberOfResults;
			this.pageNumber = response.pageNumber;
			this.pageSize = response.pageSize;
			return response.page;
		},

		set : function() {

			var models = Backbone.Collection.prototype.set.apply(this,
					arguments);
			models = _.isArray(models) ? models : [ models ];

			models.forEach(function(e) {
				if (e.isNew()) {
					this.listenToOnce(e, 'sync', this.incrementTotalSize);
				}
				e.on('remove', function(model, collection) {
					if (collection === this) {
						this.stopListening(model, 'sync');
					}
				})
			}.bind(this));

			return models;
		}

	});

	return PagedCollection;
});