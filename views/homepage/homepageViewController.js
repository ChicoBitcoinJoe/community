Community.controller('HomepageViewController', ['$scope','$mdSidenav',
function($scope, $mdSidenav) {
    $scope.hello = "Hello Community!";
    $scope.toggle = function(id) { 
        $mdSidenav(id).toggle();
        console.log('here');
    };
}]);

