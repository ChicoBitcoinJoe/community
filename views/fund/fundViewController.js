Community.controller('fundViewController', ['$scope','VoteHub',
function($scope, Community){
    console.log('Loading fund view: ' + $scope.activeView);
    
    $scope.fundAmount = 0.05;
    
    $scope.communityPercent = 75;
    $scope.ethereumPercent = 20;
    $scope.metamaskPercent = 5;
    
    $scope.alternativePercent = 25;
    $scope.oldPercent = 25;
    setInterval(function(){
        $scope.alternativePercent = 100 - $scope.communityPercent;
        if($scope.oldPercent != $scope.alternativePercent){
            $scope.ethereumPercent = Math.round($scope.alternativePercent/2);
        }
        
        $scope.metamaskPercent = $scope.alternativePercent - $scope.ethereumPercent;
        $scope.oldPercent = $scope.alternativePercent;
    },100);
    
    $scope.fundDevelopment = function(){
        console.log($scope.activeView, $scope.fundAmount);
    }
}]);