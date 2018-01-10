var app = angular.module("module_name",["ngRoute", "ngResource"])
	.config(function($routeProvider) {
		$routeProvider
			.when("/", {
				controller: "sessionController_index",
				templateUrl: "views/index.html"
			})
			.when("/webs", {
				controller: "webController_list",
				templateUrl: "views/webs/index.html"
			})
			.when("/webs/:webId", {
				controller: "webController_findById",
				templateUrl: "views/webs/show.html"
			})
			.when("/new", {
				controller: "webController_addWebForm",
				templateUrl: "views/webs/new.html"
			})
			.when("/webs/:webId/:filterId", {
				controller: "webController_updateFilterOfWebForm",
				templateUrl: "views/webs/filter.html"
			})
			.otherwise("/");
	})