Community.controller('CommunityStatsViewController', ['$scope','$location',
function($scope,$location){
    console.log('Loading Community Stats View');
    var locationUrlArray = $location.url().split('/');
    $scope.viewType = locationUrlArray[1];
    $scope.activeView = locationUrlArray[2];
}]);