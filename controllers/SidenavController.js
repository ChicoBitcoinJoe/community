Community.controller('SidenavController', ['$scope','$mdSidenav','$location','ProfileDB',
function($scope, $mdSidenav, $location, ProfileDB) {
    $scope.toggle = function(id) { $mdSidenav(id).toggle(); };
    
    $scope.account = ProfileDB.getCurrentAccount();
    $scope.username = 'Username';

    var locationUrlArray = $location.url().split('/');
    $scope.viewType = locationUrlArray[1];
    $scope.activeView = locationUrlArray[2];
    $scope.multis = ProfileDB.getSavedMultis();
    $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
    $scope.all = ProfileDB.getCommunitiesInMulti('all');

    
    $scope.$on('$routeChangeSuccess', function(newHeader) {
        var locationUrlArray = $location.url().split('/');
        $scope.viewType = locationUrlArray[1];
        $scope.activeView = locationUrlArray[2];if($scope.viewType === 'c')
        $scope.multis = ProfileDB.getSavedMultis();
        $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
    });
    
    $scope.toggleSettings = false;
    
    $scope.addCommunity = function(communityName){
        ProfileDB.addCommunity(communityName,$scope.activeView);
        $scope.newCommunity = "";
    }
    
    $scope.createMulti = function(multiName){
        ProfileDB.createMulti(multiName);
        $scope.multis = ProfileDB.getSavedMultis();
        $scope.newMulti = "";
    }
    
    $scope.removeCommunity = function(communityName){
        ProfileDB.removeCommunity(communityName,$scope.activeView);
    }
    
    $scope.deleteMulti = function(multiName){
        ProfileDB.deleteMulti(multiName);
        $scope.multis = ProfileDB.getSavedMultis();
    }
    
    $scope.publicOpinionWeight = 50;
    $scope.isDisabled = true;
}]);