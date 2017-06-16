define(function(require) {
	var InvoiceListItemView = require('./InvoiceAsListItemView');
	var Invoice = require('./InvoiceModel');
	var ComposedView = require('base/ComposedView');
	var paginationTemplate = require('text!pagination/pagination.template');
	var template = require('text!invoices/invoices-list.template');
	var InvoicesView = ComposedView
			.extend({
				tagName : 'div',
				events : {
					"click #add" : "create",
					"click .pagelink" : "changePage",
					"click #search" : "search",
					"click #show" : "show",
					"change #totalPriceFrom" : "totalPriceFrom",
					"change #totalPriceTo" : "totalPriceTo"
				},

				template : _.template(template),
				templatePagination : _.template(paginationTemplate),

				initialize : function(arg) {
					ComposedView.prototype.initialize.apply(this);
					this.listenTo(this.model, 'add', this.addOne);
					this.listenTo(this.model, 'reset', this.addAll);
					this.listenTo(this.model, 'change:totalSize',
							this.updateTotalNumber);
					this.viewConfig = arg.viewConfig;
				},

				render : function() {
					this.$el.html(this.template(this.viewConfig));
					return this
				},

				addOne : function(invoice) {
					var view = this.registerSubView(new InvoiceListItemView({
						model : invoice
					}));

					var el = view.render().el;
					this.$("#invoices-table").append(el);
				},

				addAll : function() {
					this.removeSubviews();
					this.model.each(this.addOne, this);
					this.updatePaginationInfo();
					hideColumn([ '业务类别', '交易类型', '支付类型', '付款有效期', '消费有效期',
							'已支付金额', '已退款金额', '已结算金额', '退款状态', '对账状态', '分账状态',
							'结算状态', '来源' ], true);
				},
				updatePaginationInfo : function() {
					this.updateTotalNumber();
					this.$(".pagination").html(
							this.templatePagination(this.model));
				},

				updateTotalNumber : function() {
					this.$(".totalResults").html(
							" (" + this.model.totalNumberOfResults
									+ " in total on server)");
				},

				changePage : function(e) {
					this.model.pageNumber = $(e.currentTarget)
							.attr("data-page");
					this.model.fetch({
						reset : true
					});
				},

				prepareCreate : function() {
					if (this.creationView) {
						this.subviews.splice(this.creationViewIndex, 1);
						this.creationView.remove();
					}
					this.creationView = new InvoiceListItemView({
						model : new Invoice({}, {
							collection : this.model
						})
					});
					this.creationViewIndex = this.subviews.length - 1;
					this.creationModal.html(this.creationView.render().el);
				},
				
				create : function() {
					if (!this.input.val())
						return;

					this.model.create({
						description : this.input.val()
					});
					this.input.val('');
				},
				show : function() {
					$("#more").toggleClass("showMore");
				},
				totalPriceFrom : function() {
					var event = window.event
							|| arguments.callee.caller.arguments[0];
					$(event.target).val(parseFloat($(event.target).val()));
					$(event.target).attr("value",
							parseFloat($(event.target).val()));
				},
				totalPriceTo : function() {
					var event = window.event
							|| arguments.callee.caller.arguments[0];
					$(event.target).val(parseFloat($(event.target).val()));
					$(event.target).attr("value",
							parseFloat($(event.target).val()));
				},
				search : function() {
					var id = this.$("#id").val() === "" ? null : this.$("#id")
							.val();
					var orderStatus = this.$("#orderStatus").val();
					var payStatus = this.$("#payStatus").val();
					var outTradeNo = this.$("#outTradeNo").val();
					var buyer = this.$("#search_buyer").val();
					var issuerName = this.$("#issuerName").val();
					var creationFromTime = this.$("#creationFromTime").val();
					var creationToTime = this.$("#creationToTime").val();
					var source = this.$("#source").val();
					var tradeType = this.$("#tradeType").val();
					var paymentType = this.$("#paymentType").val();
					var invoiceRefundStatus = this.$("#invoiceRefundStatus")
							.val();
					var splitStatus = this.$("#splitStatus").val();
					var settlementStatus = this.$("#settlementStatus").val();
					var reconciliationStatus = this.$("#reconciliationStatus")
							.val();
					var totalPriceFrom = this.$("#totalPriceFrom").val();
					var totalPriceTo = this.$("#totalPriceTo").val();
					var businessType = this.$("#businessType").val();
					var paymentFromTime = this.$("#paymentFromTime").val();
					var paymentToTime = this.$("#paymentToTime").val();
					var paymentId = this.$("#paymentId").val();
					var txnCompleteFromTime = this.$("#txnCompleteFromTime")
							.val();
					var txnCompleteToTime = this.$("#txnCompleteToTime").val();
					var consumeLimitFromTime = this.$("#consumeLimitFromTime")
							.val();
					var consumeLimitToTime = this.$("#consumeLimitToTime")
							.val();

					if (totalPriceFrom !== "" || totalPriceTo !== "") {
						if (totalPriceFrom === "") {
							alertOnCondition(true, "请输入查询金额的最小范围");
							return
						}
						if (totalPriceTo === "") {
							alertOnCondition(true, "请输入查询金额的最大范围");
							return
						}
						if (parseFloat(totalPriceFrom) > parseFloat(totalPriceTo)) {
							alertOnCondition(true, "金额的最大范围需大于最小范围");
							return;
						}
						if (parseFloat(totalPriceFrom) < 0) {
							alertOnCondition(true, "金额范围不能为负数");
							return;
						}
					}
					if (!checkDateStrings(creationFromTime, creationToTime,
							"创建时间中，结束日期的*数不能小于开始日期"))
						return false;
					if (!checkDateStrings(paymentFromTime, paymentToTime,
							"支付完成时间中，结束日期的*数不能小于开始日期"))
						return false;
					if (!checkDateStrings(txnCompleteFromTime,
							txnCompleteToTime, "交易完成时间中，结束日期的*数不能小于开始日期"))
						return false;
					if (!checkDateStrings(consumeLimitFromTime,
							consumeLimitToTime, "消费有效期时间中，结束日期的*数不能小于开始日期"))
						return false;

					this.model.pageNumber = 0;
					this.model.data = {
						businessType : 'TRADE',
						id : id,
						orderStatus : orderStatus
								|| this.viewConfig.orderStatus,
						payStatus : payStatus || this.viewConfig.payStatus,
						outTradeNo : outTradeNo,
						buyer : buyer,
						issuerName : issuerName,
						creationFromTime : creationFromTime,
						creationToTime : creationToTime,
						source : source,
						tradeType : tradeType || this.viewConfig.tradeType,
						paymentType : paymentType
								|| this.viewConfig.paymentType,
						invoiceRefundStatus : invoiceRefundStatus
								|| this.viewConfig.invoiceRefundStatus,
						splitStatus : splitStatus
								|| this.viewConfig.splitStatus,
						settlementStatus : settlementStatus
								|| this.viewConfig.settlementStatus,
						reconciliationStatus : reconciliationStatus
								|| this.viewConfig.reconciliationStatus,
						paymentFromTime : paymentFromTime,
						paymentToTime : paymentToTime,
						paymentId : paymentId,
						txnCompleteFromTime : txnCompleteFromTime,
						txnCompleteToTime : txnCompleteToTime,
						consumeLimitFromTime : consumeLimitFromTime,
						consumeLimitToTime : consumeLimitToTime
					};

					totalPriceFrom.trim().length === 0
							|| Object.assign(this.model.data, {
								totalPriceFrom : totalPriceFrom
							});
					totalPriceTo.trim().length === 0
							|| Object.assign(this.model.data, {
								totalPriceTo : totalPriceTo
							});

					this.model
							.fetch({
								reset : true,
								error : function(collection, response) {
									alertOnCondition(
											true,
											"操作失败，请联系管理员。\n错误信息：输入值  "
													+ response.responseJSON.parameterViolations[0].value
													+ " "
													+ response.responseJSON.parameterViolations[0].message
													+ "！");
								}
							});
				}

			});

	return InvoicesView;

});