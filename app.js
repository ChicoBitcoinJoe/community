var Community = angular.module('Community',['ngRoute','ngMaterial','ngMessages','material.svgAssetsCache']);

Community.config(function ($routeProvider) {
	$routeProvider.
    when('/m/:multi', {
        templateUrl: 'views/multi/multiView.html',
        controller: 'MultiViewController'
    }).
    when('/c/:community', {
        templateUrl: 'views/community/communityView.html',
        controller: 'CommunityViewController'
    }).
	otherwise({
      redirectTo: '/c/all'
    });
});

Community.config(function($mdThemingProvider) {
     $mdThemingProvider
    .theme('dark-theme')
    .primaryPalette('blue-grey')
    .accentPalette('amber')
    .warnPalette('deep-orange')
    .backgroundPalette('grey')
    .dark();
});

Community.run(['$rootScope','$location', function($rootScope,$location) {
    console.log('Community booting up.');
    
    $rootScope.$on('$routeChangeSuccess', function() {
        var locationUrlArray = $location.url().split('/');
        $rootScope.header = locationUrlArray[2];
        $rootScope.$broadcast('headerChange',$rootScope.header);
    });
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