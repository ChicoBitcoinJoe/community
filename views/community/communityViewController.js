Community.controller('CommunityViewController', ['$scope','Community',
function($scope, Community){
    console.log('Loading community view: ' + $scope.activeView);
    
    $scope.created = false;
    $scope.loaded = false;
    
    var community = [$scope.activeView];
    Community.communityExists($scope.activeView).then(
    function(exists){
        if(exists){
            $scope.created = true;
        } else { 
            $scope.loaded = true;
            $scope.posts = Community.getPosts(community);
        }
    }, function(err){
        console.error(err);
    });
    
}]);