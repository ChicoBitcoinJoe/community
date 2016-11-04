var Community = angular.module('Community',['ngRoute','ngMaterial']);

Community.config(function ($routeProvider) {
	$routeProvider.
    when('/m/all', {
        templateUrl: 'views/homepage/homepageView.html',
        controller: ''
    }).
    when('/m/:multi', {
        templateUrl: 'views/homepage/homepageView.html',
        controller: ''
    }).
    when('/c/:community', {
        templateUrl: 'views/homepage/homepageView.html',
        controller: ''
    }).
	otherwise({
      redirectTo: '/m/all'
    });
});

Community.run([ function() {
    console.log('Community booting up.');
}]);

Community.filter('capitalize', function() {
    return function(input){
        if(input){
            if(input.indexOf(' ') !== -1){
                var input = input.toLowerCase();
                var inputPieces = input.split(' ');
                for(i = 0; i < inputPieces.length; i++){
                    inputPieces[i] = capitalizeString(inputPieces[i]);
                }
                return inputPieces.toString().replace(/,/g, ' ');
            } else {
                input = input.toLowerCase();
                return capitalizeString(input);
            }

            function capitalizeString(inputString){
                return inputString.substring(0,1).toUpperCase() + inputString.substring(1);
            }
        };
    }
});