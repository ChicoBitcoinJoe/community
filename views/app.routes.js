app.config(function ($routeProvider) {
	$routeProvider.
    when('/c/:community', {
        templateUrl: 'views/community/community.view.html',
        controller: 'CommunityController'
    }).
    when('/m/:multi', {
        templateUrl: 'views/multi/multi.view.html',
        controller: 'MultiController'
    }).
    when('/c/:community/compose', {
        templateUrl: 'views/compose/compose.view.html',
        controller: 'ComposeController'
    }).
    when('/c/:community/:postHash', {
        templateUrl: 'views/comments/comments.view.html',
        controller: 'CommentsController'
    }).
	otherwise({
      redirectTo: '/c/community'
    });
});