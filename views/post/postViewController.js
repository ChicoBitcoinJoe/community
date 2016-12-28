Community.controller('PostViewController', ['$scope','ProfileDB','Community',
function($scope,ProfileDB,Community) {
    console.log('Loading Posts: ' + $scope.activeView);
    
    $scope.created = false;
    $scope.loaded = false;
    
    var communities = [];
    if($scope.viewType == 'c'){
        Community.communityExists($scope.activeView).then(
        function(exists){
            if(exists){
                $scope.created = true;
            } else { 
                $scope.loaded = true;
            }
        });
        
        communities = [$scope.activeView];
    } else {
        communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
    }
    
    $scope.posts = Community.getPosts(communities);
}]);