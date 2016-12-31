Community.controller('HomepageViewController', ['$scope',
function($scope){
    console.log('Loading Homepage View');
    
    $scope.mark = function(){
        $scope.notes = marked(JSON.stringify($scope.included));
        console.log($scope.included,$scope.notes);
    }
}]);