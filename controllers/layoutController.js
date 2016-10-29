Community.controller('LayoutController', ['$scope','$mdSidenav',
function($scope, $mdSidenav) {
    $scope.toggle = function(id) { 
        $mdSidenav(id).toggle();
        console.log('there');
    };
}]);

