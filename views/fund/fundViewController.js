Community.controller('FundViewController', ['$scope','VoteHub','Web3Service',
function($scope,VoteHub,Web3Service){
    console.log('Loading fund view');
    
    $scope.fundAmount = 0.01;
    
    $scope.account = Web3Service.getCurrentAccount();
    $scope.community = $scope.activeView;
    
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