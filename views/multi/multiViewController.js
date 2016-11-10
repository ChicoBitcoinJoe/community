Community.controller('MultiViewController', ['$scope','ProfileDB','EventHandler','LinkDB',
function($scope,ProfileDB,EventHandler,LinkDB) {
    console.log('Loading multi view: ' + $scope.activeView);
    console.log($scope.activeView);
    $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
    
    $scope.posts = [];
    $scope.multi = {};
    
    for(index in $scope.communities){
        console.log("Watching " + $scope.communities[index]);
        
        EventHandler.watch($scope.communities[index]);
        var community = $scope.communities[index];
        $scope.multi[community] = LinkDB.getShardEvents(community);
        $scope.posts = $scope.posts.concat($scope.multi[community]);
        console.log($scope.posts);
    }
}]);