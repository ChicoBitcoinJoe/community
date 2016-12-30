Community.controller('FavoriteViewController', ['$scope','ProfileDB','Community',
function($scope,ProfileDB,Community) {
    console.log('Loading Favorite View');
    
    $scope.favorites = [];
    var favs = ProfileDB.getFavorites($scope.activeView);
    
    for(index in favs){
        $scope.favorites.push({txHash:favs[index]});
    }
}]);