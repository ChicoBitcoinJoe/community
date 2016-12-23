Community.controller('MultiStatsViewController', ['$scope','$location',
function($scope,$location){
    console.log('Loading Multi Stats View');
    var locationUrlArray = $location.url().split('/');
    $scope.viewType = locationUrlArray[1];
    $scope.activeView = locationUrlArray[2];
}]);