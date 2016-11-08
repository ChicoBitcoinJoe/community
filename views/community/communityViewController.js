Community.controller('CommunityViewController', ['$scope','Community',
function($scope, Community) {
    console.log('Loading community View: ' + $scope.activeView);
    
    $scope.posts = [];
    $scope.created = false;
    var asyncGetPosts = Community.getPosts($scope.activeView).then(
    function(created){
        if(created){
            $scope.created = true;
            $scope.posts = created;
        } else {
            $scope.loaded = true;
        }
    }, function(err){
        console.error(err);
    });
}]);