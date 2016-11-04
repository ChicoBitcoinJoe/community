Community.directive('toolbar', ['$mdSidenav', '$location', 'ProfileDB',
function($mdSidenav, $location, ProfileDB) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/toolbar/toolbarDirective.html',
		controller: function($scope, $mdSidenav){
            $scope.toggleSidenav = function(id) { $mdSidenav(id).toggle(); };

            $scope.showSearchbar = false;
            $scope.toggleSearch = function(id) { $scope.showSearchbar = !$scope.showSearchbar };
            $scope.search = function(){
                if($scope.searchQuery){
                    $location.path("/c/"+$scope.searchQuery.toLowerCase());
                    $scope.searchQuery = null;
                }
            }
            
            var url = $location.url().split('/');
            if(url[1] === 'm' || url[1] === 'c')
                $scope.header = url[2];
            else   
                $scope.header = url[1];
            
            $scope.viewType = url[1]
            
            if($scope.viewType == 'c' && ProfileDB.communityIsSaved($scope.header))
                $scope.star = "star";
            else if($scope.viewType == 'm' && ProfileDB.multiIsSaved($scope.header))
                $scope.star = "star";
            else
                $scope.star = "star_border";
            
            $scope.quickSave = function(){
                if($scope.viewType == 'c'){
                    ProfileDB.addCommunity($scope.header,'all');
                    $scope.star = "star";
                }
            }
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);