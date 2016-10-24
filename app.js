var Community = angular.module('Community',['ngRoute','ngMaterial']);

Community.config(function ($routeProvider) {
	$routeProvider.
    when('/homepage', {
        templateUrl: 'views/homepage/homepageView.html',
        controller: 'HomepageViewController'
    }).
	otherwise({
      redirectTo: '/homepage'
    });
});