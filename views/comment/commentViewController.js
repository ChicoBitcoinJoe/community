Community.controller('CommentViewController', ['$scope','$location',
function($scope,$location) {
    console.log('Loading comment view: ' + $scope.activeView);
    
    var locationUrlArray = $location.url().split('/');
    $scope.viewType = locationUrlArray[1];
    $scope.activeView = locationUrlArray[2];
    $scope.ipfsHash = locationUrlArray[4];
    
    $scope.comments = [];
}]);