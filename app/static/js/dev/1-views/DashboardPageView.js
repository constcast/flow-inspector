var DashboardPageView = PageView.extend({
	events: {
		"click .timeline-value a": "clickTimelineValue",
		"click .hostview-value a": "clickHostviewValue",
		"click .bucket-chart-value a": "clickBucketChartValue",
		"click .donut-chart-value a": "clickDonutChartValue",
	},
	initialize: function() {
		this.template = _.template($("#dashboard-page-template").html());

		this.timelineModel = new TimelineModel();
		this.timelineView = new TimelineView({
			model: this.timelineModel
		});
		this.timelineModel.bind("change:interval", this.changeBucketInterval, this);
		this.timelineModel.bind("change:value", this.changeTimelineValue, this);
		this.timelineModel.bind("change:bucket_size", this.changeBucketSize, this);

		this.hostModel = new HostViewModel();
		this.hostModel.bind("change:value", this.changeHostViewValue, this);
		this.hostView = new HostView({ model: this.hostModel, index: new DynamicIndexQuery(null, { index: this.hostModel.get("index")}), fetchEmptyInterval: false  });
		
		this.bucketChartModel = new BucketChartModel();
		this.bucketChartModel.bind("change:value", this.changeBucketChartValue, this);
		this.bucketChartView = new BucketChartView({ model: this.bucketChartModel, fetchEmptyInterval: false});
		
		this.nodesDonutModel = new DonutChartModel({ index: "nodes" });
		this.nodesDonutModel.bind("change:value", this.changeDonutChartValue, this);
		this.nodesDonutView = new DonutChartView({ model: this.nodesDonutModel, index: new DynamicIndexQuery(null, {index: "nodes"}), fetchEmptyInterval: false});
		
		this.portsDonutModel = new DonutChartModel({ index: "ports" });
		this.portsDonutView = new DonutChartView({ model: this.portsDonutModel, index: new DynamicIndexQuery(null, {index: "ports"}), fetchEmptyInterval: false});
	},
	render: function() {
		$(this.el).html(this.template());

		$(".timeline-value li[data-value='" + this.timelineModel.get("value") + "']", this.el)
			.addClass("active");
		$(".hostview-value li[data-value='" + this.hostModel.get("value") + "']", this.el)
			.addClass("active");
		$(".bucket-chart-value li[data-value='" + this.bucketChartModel.get("value") + "']", this.el)
			.addClass("active");
		$(".donut-chart-value li[data-value='" + this.nodesDonutModel.get("value") + "']", this.el)
			.addClass("active");

		$(".viz-timeline", this.el).append(this.timelineView.el);
		$(".viz-hostview", this.el).append(this.hostView.el);
		$(".viz-buckets", this.el).append(this.bucketChartView.el);
		$(".viz-donut-nodes", this.el).append(this.nodesDonutView.el);
		$(".viz-donut-ports", this.el).append(this.portsDonutView.el);
		
		this.hostView.render();
		this.bucketChartView.render();
		this.nodesDonutView.render();
		this.portsDonutView.render();

		this.timelineView.delegateEvents();
		this.timelineView.render();
		
		return this;
	},
	clickTimelineValue: function(e) {
		var target = $(e.target).parent();
		this.timelineModel.set({ value: target.data("value") });
	},
	clickHostviewValue: function(e) {
		var target = $(e.target).parent();
		this.hostModel.set({ value: target.data("value") });
	},
	clickBucketChartValue: function(e) {
		var target = $(e.target).parent();
		this.bucketChartModel.set({ value: target.data("value") });
	},
	clickDonutChartValue: function(e) {
		var target = $(e.target).parent();
		this.nodesDonutModel.set({ value: target.data("value") });
		this.portsDonutModel.set({ value: target.data("value") });
	},
	changeTimelineValue: function(model, value) {
		$(".timeline-value li", this.el).removeClass("active");
		$(".timeline-value li[data-value='" + value + "']", this.el)
			.addClass("active");
	},
	changeHostViewValue: function(model, value) {
		$(".hostview-value li", this.el).removeClass("active");
		$(".hostview-value li[data-value='" + value + "']", this.el)
			.addClass("active");
	},
	changeBucketChartValue: function(model, value) {
		$(".bucket-chart-value li", this.el).removeClass("active");
		$(".bucket-chart-value li[data-value='" + value + "']", this.el)
			.addClass("active");
	},
	changeDonutChartValue: function(model, value) {
		$(".donut-chart-value li", this.el).removeClass("active");
		$(".donut-chart-value li[data-value='" + value + "']", this.el)
			.addClass("active");
	},
	changeBucketInterval: function(model, interval) {
		//this.loader.show();
		this.bucketChartModel.set({ interval: interval });
		this.hostModel.set({ interval: interval });
		this.nodesDonutModel.set({ interval: interval });
		this.portsDonutModel.set({ interval: interval });
	},
	changeBucketSize: function(model, bucket_size) {
		this.hostModel.set({bucket_size: bucket_size});
		this.nodesDonutModel.set({bucket_size: bucket_size});
		this.portsDonutModel.set({bucket_size: bucket_size});
	}
});
