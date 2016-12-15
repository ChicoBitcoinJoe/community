Community.controller('fundViewController', ['$scope',
function($scope){
    console.log('Loading fund view: ' + $scope.activeView);
    
    $scope.fundAmount = 0.05;
    
    $scope.fundDevelopment = function(){
        console.log($scope.activeView, $scope.fundAmount);
    }
}]);