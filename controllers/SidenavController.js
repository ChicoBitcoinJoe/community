Community.controller('SidenavController', ['$scope','$mdSidenav','$location','ProfileDB',
function($scope, $mdSidenav, $location, ProfileDB) {
    $scope.toggle = function(id) { $mdSidenav(id).toggle(); };
    
    $scope.account = ProfileDB.getCurrentAccount();
    $scope.username = 'Username';
    
    $scope.viewType = $location.url().split('/')[1];
    $scope.activeView = $location.url().split('/')[2];
    
    $scope.multis = ProfileDB.getSavedMultis();
    $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
    
    $scope.$on('$routeChangeSuccess', function() {
        $scope.viewType = $location.url().split('/')[1];
        $scope.activeView = $location.url().split('/')[2];
        $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView);
        $scope.multis = ProfileDB.getSavedMultis();
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
}]);