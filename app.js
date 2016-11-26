var Community = angular.module('Community',['RecursionHelper','ngRoute','ngMaterial','ngMessages','material.svgAssetsCache']);

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
    when('/c/:community/fund', {
        templateUrl: 'views/fund/fundView.html',
        controller: 'fundViewController'
    }).
    when('/c/:community/post/:postTxHash', {
        templateUrl: 'views/comment/commentView.html',
        controller: 'CommentViewController'
    }).
	otherwise({
      redirectTo: '/m/all'
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
        $rootScope.viewType = locationUrlArray[1];
        $rootScope.activeView = locationUrlArray[2];
        $rootScope.$broadcast('headerChange',$rootScope.activeView);
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

Community.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

Community.filter('round', [function() {
    return function(val) {
        return val.toFixed(1);
    };
}]);