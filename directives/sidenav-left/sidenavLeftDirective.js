Community.directive('sidenavLeft', ['$mdSidenav','$location','ProfileDB',
function($mdSidenav, $location, ProfileDB) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/sidenav-left/sidenavLeftDirective.html',
		controller: function($scope, $mdSidenav){
            $scope.toggle = function(id) { $mdSidenav(id).toggle(); };
    
            $scope.account = ProfileDB.getCurrentAccount();
            $scope.username = 'Username';

            var locationUrlArray = $location.url().split('/');
            $scope.viewType = locationUrlArray[1];
            $scope.activeView = locationUrlArray[2];
            
            $scope.multis = ProfileDB.getSavedMultis().sort();
            if($scope.viewType == 'm')
                $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView).sort();
            else
                $scope.communities = ProfileDB.getCommunitiesInMulti('all').sort();
            
            $scope.$on('$routeChangeSuccess', function(newHeader) {
                var locationUrlArray = $location.url().split('/');
                $scope.viewType = locationUrlArray[1];
                $scope.activeView = locationUrlArray[2];if($scope.viewType === 'c')
                    
                $scope.multis = ProfileDB.getSavedMultis().sort();
                if($scope.viewType == 'm')
                    $scope.communities = ProfileDB.getCommunitiesInMulti($scope.activeView).sort();
                else
                    $scope.communities = ProfileDB.getCommunitiesInMulti('all').sort();
            });
            
            $scope.toggleSettings = false;

            $scope.addCommunity = function(communityName){
                ProfileDB.addCommunity(communityName,$scope.activeView);
                $scope.newCommunity = "";
            };

            $scope.createMulti = function(multiName){
                ProfileDB.createMulti(multiName);
                $scope.multis = ProfileDB.getSavedMultis();
                $scope.newMulti = "";
            };

            $scope.removeCommunity = function(communityName){
                ProfileDB.removeCommunity(communityName,$scope.activeView);
            };

            $scope.deleteMulti = function(multiName){
                ProfileDB.deleteMulti(multiName);
                $scope.multis = ProfileDB.getSavedMultis();
            };
            
            $scope.goTo = function(url){
                //console.log(url);
                $location.url(url);
            };
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);
