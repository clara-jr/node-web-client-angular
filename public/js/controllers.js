angular.module("module_name")
.controller("sessionController_logout", function($cookies, $location, $rootScope) {
  // Removing a cookie
  $cookies.remove('user');
  $rootScope.username = "";
  $location.path('/');
})
.controller("sessionController_index", function($cookies, $location, $rootScope, $scope, $http, $resource) {
  console.log("sessionController_index");
  var cookie = $cookies.get('user');
  console.log(cookie);
  $scope.title = "Welcome";
  $rootScope.username = cookie;
  if (!cookie) {
    $rootScope.color = "rgba(0,0,0,0)";
  }
  $scope.login = function() {
    $resource('http://localhost:8080/login/:u/:p', {u: "@u", p: "@p"})
      .get({u: $scope.user.login}, {p: $scope.user.password}, function(data) {
      console.log(data);
      var cookie = undefined;
      if (data.correct) {
        // Setting a cookie
        $cookies.put('user', $scope.user.login);
        // Retrieving a cookie
        cookie = $cookies.get('user');
        $rootScope.color = "rgba(0,0,0,.08)";
        console.log(cookie);
      } else {
        $scope.error = data.message;
      }
      $rootScope.username = cookie;
      $scope.user = {};
      $location.path('/');
    });
  };
})
.controller("webController_list", function($cookies, $location, $rootScope, $scope, $http, $resource) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_list");
  $scope.webs = $resource('http://localhost:8080/webs').query();
})
.controller("webController_findById", function($cookies, $location, $rootScope, $scope, $http, $resource, $routeParams) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_findById");
  $resource('http://localhost:8080/webs/:webId', {webId: "@webId"}).get({webId: $routeParams.webId}, function(data) {
    console.log(data);
    if (data.error) {
      $scope.error = data.error;
    } else {
      $scope.web = data;
    }
  });
  $scope.deleteWeb = function(webId) {
    $resource('http://localhost:8080/webs/:webId', {webId: "@webId"}).delete({webId: webId}, function(data) {
      console.log(data);
      $location.path('/webs');
    });
  };
  $scope.addFilterToWeb = function(webId) {
    pattern = $scope.newFilter.pattern;
    type = $scope.newFilter.type;
    var datajson = {
      pattern: pattern,
      filterType: type
    };
    $http({
        method: 'PUT',
        url: 'http://localhost:8080/webs/'+webId,
        data: datajson
      }).then(function(data, status, headers, config){
        console.log(data);
        $scope.web.filters.push($scope.newFilter);
        $scope.newFilter = {};
      },function(error, status, headers, config){
        console.log(error);
    });
  };
})
.controller("webController_addWebForm", function($cookies, $location, $rootScope, $scope, $http, $resource) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_addWebForm");
  $scope.addWeb = function(webId) {
    $resource('http://localhost:8080/webs/').save({data: $scope.newWeb}, function(data) {
      console.log(data);
      if (data.error) {
        $scope.error = data.error;
      } else {
        $scope.newWeb = {};
        $location.path('/webs');
      }
    });
  }
})
.controller("webController_updateFilterOfWebForm", function($cookies, $location, $rootScope, $scope, $http, $resource, $routeParams) {
  var cookie = $cookies.get('user');
  if (!cookie) {
    $location.path('/');
  }
  $rootScope.username = cookie;
  console.log("webController_updateFilterOfWebForm");
  $resource('http://localhost:8080/webs/:webId/:filterId', {webId: "@webId", filterId: "@filterId"})
    .get({webId: $routeParams.webId}, {filterId: $routeParams.filterId}, function(data) {
    console.log(data);
    if (data.error) {
      $scope.error = data.error;
    } else {
      $scope.filter = data;
      $scope.webId = $routeParams.webId;
    }
  });
  $scope.deleteFilter = function(webId, filterId) {
    $resource('http://localhost:8080/webs/:webId/:filterId', {webId: "@webId", filterId: "@filterId"}).delete({webId: webId}, {filterId: filterId}, function(data) {
      console.log(data);
      $location.path('/webs/'+webId);
    });
  }
  $scope.updateFilter = function(webId, filterId) {
    pattern = $scope.filter.pattern;
    type = $scope.filter.type;
    var datajson = {
      pattern: pattern,
      filterType: type
    };
    $http({
        method: 'PUT',
        url: 'http://localhost:8080/webs/'+webId+'/'+filterId,
        data: datajson
      }).then(function(data, status, headers, config){
        console.log(data);
        $location.path('/webs/'+webId);
      },function(error, status, headers, config){
        console.log(error);
    });
  }
});
