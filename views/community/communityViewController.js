Community.controller('CommunityViewController', ['$scope','Community',
function($scope, Community){
    console.log('Loading community view: ' + $scope.activeView);
    
    $scope.created = false;
    $scope.loaded = false;
    
    var communities = [$scope.activeView];
    Community.exists($scope.activeView).then(
    function(exists){
        if(exists)
            $scope.created = true;
        else 
            $scope.loaded = true;
    }, function(err){
        console.error(err);
    }); 
    
    $scope.posts = Community.getPosts(communities);
}]);