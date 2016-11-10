Community.controller('CommunityViewController', ['$scope','LinkDB',
function($scope, LinkDB){
    console.log('Loading community view: ' + $scope.activeView);
    
    $scope.posts = [];
    $scope.created = false;
    
    var communities = [$scope.activeView];
    var asyncGetPosts = LinkDB.getShardAddress($scope.activeView).then(
    function(created){
        if(created){
            $scope.created = true;
            $scope.posts = LinkDB.getShardEvents($scope.activeView);
        } else {
            $scope.loaded = true;
        }
    }, function(err){
        console.error(err);
    });
}]);