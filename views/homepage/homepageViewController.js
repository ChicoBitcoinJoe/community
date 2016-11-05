Community.controller('HomepageViewController', ['$scope',
function($scope) {
    $scope.imagePaths = [
        'images/bumble_bee.jpg',
        'images/red_flowers.jpg',
        'images/bumble_bee.jpg',
        'images/red_flowers.jpg'];
    
    console.log($scope.imagePaths);
}]);