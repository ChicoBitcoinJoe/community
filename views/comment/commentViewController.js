Community.controller('CommentViewController', ['$scope','$location','Community',
function($scope,$location,Community) {
    console.log('Loading comment view: ' + $scope.activeView);
    
    var locationUrlArray = $location.url().split('/');
    $scope.viewType = locationUrlArray[1];
    $scope.activeView = locationUrlArray[2];
    $scope.txHash = locationUrlArray[4];
    Community.getPosts([$scope.activeView]);
}]);