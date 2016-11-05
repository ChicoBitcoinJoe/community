Community.directive('toolbar', ['$mdSidenav', '$location', 'ProfileDB',
function($mdSidenav, $location, ProfileDB) {
	return {
		restrict: 'E',
		scope: {
            community:'='
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
                $scope.community = url[2];
            else   
                $scope.community = url[1];
            
            $scope.viewType = url[1]
            
            if($scope.viewType == 'c' && ProfileDB.communityIsSaved($scope.community))
                $scope.star = "star";
            else if($scope.viewType == 'm' && ProfileDB.multiIsSaved($scope.community))
                $scope.star = "star";
            else
                $scope.star = "star_border";
            
            $scope.quickSave = function(){
                if($scope.viewType == 'c'){
                    ProfileDB.addCommunity($scope.community,'all');
                    $scope.star = "star";
                }
            }
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);