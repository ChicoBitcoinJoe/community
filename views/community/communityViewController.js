Community.controller('CommunityViewController', ['$scope','Community','ProfileDB',
function($scope, Community, ProfileDB) {
    console.log('Loading community view: ' + $scope.activeView);
    
    $scope.posts = [];
    $scope.created = false;
    
    var communities = [];
    if($scope.viewType === 'c'){
        var asyncGetPosts = Community.getPosts($scope.activeView).then(
        function(created){
            //console.log(created);
            if(created){
                $scope.created = true;
                $scope.posts = created;
            } else {
                $scope.loaded = true;
            }
        }, function(err){
            console.error(err);
        });
    }   
}]);