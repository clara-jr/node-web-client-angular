angular.module("module_name")
.controller("sessionController_logout", function($cookies, $location, $rootScope) {
  // Removing a cookie
  $cookies.remove('user');
  $rootScope.username = "";
  $location.path('/');
})
.controller("sessionController_index", function($cookies, $location, $rootScope, $scope, $resource) {
  console.log("sessionController_index");
  var cookie = $cookies.get('user');
  console.log(cookie);
  $scope.title = "Welcome";
  $rootScope.username = cookie;
  if (!cookie) {
    $rootScope.color = "rgba(0,0,0,0)";
  }
  $scope.login = function() {
    $resource('http://localhost:1607/login/:u/:p', {u: "@u", p: "@p"})
      .get({u: $scope.user.login}, {p: $scope.user.password}).$promise.then(function(data){
        console.log(data);
        var cookie = undefined;
        // Setting a cookie
        $cookies.put('user', $scope.user.login);
        // Retrieving a cookie
        cookie = $cookies.get('user');
        $rootScope.color = "#eee";
        console.log(cookie);
        $rootScope.username = cookie;
        $scope.user = {};
        $location.path('/');
      },function(error){
        var cookie = undefined;
        $scope.error = error.data.error;
        $rootScope.username = cookie;
        $scope.user = {};
        $location.path('/');
      }
    );
  };
})
.controller("webController_list", function($cookies, $location, $rootScope, $scope, $resource) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_list");
  $scope.webs = $resource('http://localhost:1607/webs').query();
  $scope.deleteWeb = function(webId) {
    $resource('http://localhost:1607/webs/:webId', {webId: "@webId"}).delete({webId: webId}, function(data) {
      console.log(data);
      $scope.webs = $resource('http://localhost:1607/webs').query();
    });
  };
})
.controller("webController_findById", function($cookies, $location, $rootScope, $scope, $http, $resource, $routeParams) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_findById");
  $resource('http://localhost:1607/webs/:webId', {webId: "@webId"}).get({webId: $routeParams.webId}).$promise.then(function(data){
      console.log(data);
      $scope.web = data;
    },function(error){
      console.log(error);
      $scope.error = error.data.error;
    }
  );
  $scope.addFilterToWeb = function(webId) {
    pattern = $scope.newFilter.pattern;
    level = $scope.newFilter.level;
    console.log("LEVEL" + level);
    type = $scope.newFilter.type;
    var datajson = {
      pattern: pattern,
      level: level,
      filterType: type
    };
    $http({
        method: 'PUT',
        url: 'http://localhost:1607/webs/'+webId,
        data: datajson
      }).then(function(data, status, headers, config){
        console.log(data);
        $scope.web.filters.push($scope.newFilter);
        $scope.newFilter = {};
        $scope.errorFilter = "";
      },function(error, status, headers, config){
        console.log(error);
        $scope.errorFilter = error.data.error;
    });
  };
})
.controller("webController_addWebForm", function($cookies, $location, $rootScope, $scope, $resource) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_addWebForm");
  $scope.addWeb = function(webId) {
    $resource('http://localhost:1607/webs/').save({data: $scope.newWeb}).$promise.then(function(data){
        console.log(data);
        $scope.newWeb = {};
        $location.path('/webs');
      },function(error){
        console.log(error);
        $scope.error = error.data.error;
      }
    );
  };
})
.controller("webController_updateFilterOfWebForm", function($cookies, $location, $rootScope, $scope, $http, $resource, $routeParams) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_updateFilterOfWebForm");
  $resource('http://localhost:1607/webs/:webId/:filterId', {webId: "@webId", filterId: "@filterId"})
    .get({webId: $routeParams.webId}, {filterId: $routeParams.filterId}).$promise.then(function(data){
      console.log(data);
      $scope.filter = data;
      $scope.filter.level = parseInt($scope.filter.level);
      $scope.webId = $routeParams.webId;
    },function(error){
      console.log(error);
      $scope.error = error.data.error;
    }
  );
  $scope.deleteFilter = function(webId, filterId) {
    $resource('http://localhost:1607/webs/:webId/:filterId', {webId: "@webId", filterId: "@filterId"}).delete({webId: webId}, {filterId: filterId}, function(data) {
      console.log(data);
      $location.path('/webs/'+webId);
    });
  };
  $scope.updateFilter = function(webId, filterId) {
    pattern = $scope.filter.pattern;
    level = $scope.filter.level;
    type = $scope.filter.type;
    var datajson = {
      pattern: pattern,
      level: level,
      filterType: type
    };
    $http({
        method: 'PUT',
        url: 'http://localhost:1607/webs/'+webId+'/'+filterId,
        data: datajson
      }).then(function(data, status, headers, config){
        console.log(data);
        console.log(data.data);
        console.log(data.data.error);
        $location.path('/webs/'+webId);
      },function(error, status, headers, config){
        console.log(error);
        $scope.errorFilter = error.data.error;
    });
  };
});
