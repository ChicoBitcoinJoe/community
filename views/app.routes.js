app.config(function ($routeProvider) {
	$routeProvider.
    when('/', {
        templateUrl: 'views/home/home.view.html',
        controller: 'HomeController'
    }).
    when('/c/:community', {
        templateUrl: 'views/community/community.view.html',
        controller: 'CommunityController'
    }).
    when('/m/:multi', {
        templateUrl: 'views/community/community.view.html',
        controller: 'CommunityController'
    }).
    when('/c/:community/compose', {
        templateUrl: 'views/compose/compose.view.html',
        controller: 'ComposeController'
    }).
	otherwise({
      redirectTo: '/'
    });
});