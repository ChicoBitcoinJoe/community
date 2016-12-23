Community.controller('ProfileViewController', ['$scope','NameService','$window','Web3Service',
function($scope,NameService,$window,Web3Service){
    console.log('Loading Profile View');
    
    $scope.account = Web3Service.getCurrentAccount();
    
    $scope.profile = {};
    
    $scope.showButton = false;    
    $scope.updateNewName = function(newName){
        $scope.profile.newUsername = newName; 
        $scope.showButton = true;    
    };
    
    $scope.updateNewName('ChicoBitcoinJoe');
    
    $scope.changeName = function(newName){
        NameService.setName(newName).then(
        function(receipt){
            console.log("Name successfully changed to " + newName);
            $window.location.reload();
        })
    };
}]);