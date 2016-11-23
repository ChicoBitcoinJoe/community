Community.controller('MultiViewController', ['$scope','ProfileDB','Community',
function($scope,ProfileDB,Community) {
    console.log('Loading multi view: ' + $scope.activeView);
    
    var communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
    $scope.posts = Community.getPosts(communities);
}]);