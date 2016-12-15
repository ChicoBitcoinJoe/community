Community.controller('FavoriteViewController', ['$scope','ProfileDB','Community',
function($scope,ProfileDB,Community) {
    console.log('Loading Favorite View');
    
    $scope.favorites = ProfileDB.getFavorites($scope.activeView);
    console.log($scope.favorites.length,$scope.favorites);
}]);