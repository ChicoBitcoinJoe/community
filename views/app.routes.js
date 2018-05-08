app.config(function ($routeProvider) {
	$routeProvider.
    when('/', {
        templateUrl: 'views/home/homeView.html',
        controller: 'HomeViewController'
    }).
	otherwise({
      redirectTo: '/'
    });
});