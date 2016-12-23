Community.controller('FundViewController', ['$scope','VoteHub',
function($scope,VoteHub){
    console.log('Loading fund view');
    
    $scope.fundAmount = 0.01;
    
    $scope.fundDevelopment = function(){
        //console.log($scope.activeView, $scope.fundAmount);
        VoteHub.fundDevelopment($scope.activeView, $scope.fundAmount).then(
        function(receipt){
            console.log("Received " + $scope.fundAmount * 100000 + " " + $scope.activeView + " vote tokens");
        }, function(err){
            console.error(err);
        });
    }
}]);