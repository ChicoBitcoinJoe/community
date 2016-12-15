Community.directive('toolbar', ['$mdSidenav', '$location', 'ProfileDB',
function($mdSidenav, $location, ProfileDB) {
	return {
		restrict: 'E',
		scope: {
            community:'=',
            viewType:'='
		},
		replace: true,
		templateUrl: 'directives/toolbar/toolbarDirective.html',
		controller: function($scope, $mdSidenav){
            console.log('Loading toolbar');
            
            if($scope.viewType == 'c' && ProfileDB.communityIsSaved($scope.community))
                $scope.star = "star";
            else if($scope.viewType == 'm' && ProfileDB.multiIsSaved($scope.community))
                $scope.star = "star";
            else
                $scope.star = "star_border";
            
            $scope.$on('headerChange', function(event, newHeader) {
                $scope.community = newHeader;
                if($scope.viewType == 'c' && ProfileDB.communityIsSaved($scope.community))
                    $scope.star = "star";
                else if($scope.viewType == 'm' && ProfileDB.multiIsSaved($scope.community))
                    $scope.star = "star";
                else
                    $scope.star = "star_border";
            });
            
            $scope.toggleSidenav = function(id) { console.log(id); $mdSidenav(id).toggle(); };
            
            $scope.showSearchbar = false;
            $scope.toggleSearchbar = function() { $scope.showSearchbar = !$scope.showSearchbar };
            $scope.search = function(){
                if($scope.searchQuery){
                    $location.path("/c/"+$scope.searchQuery.toLowerCase());
                    $scope.searchQuery = null;
                    $scope.toggleSearchbar();
                }
            }

            $scope.quickSave = function(){
                if($scope.viewType == 'c'){
                    ProfileDB.addCommunity($scope.community,'all');
                    $scope.star = "star";
                }
            }
            
            $scope.goTo = function(option){
                console.log(option);
                if(option != $scope.menu){
                    if(option = 'favorites')
                        $location.path("/c/"+$scope.community+"/favorites");
                    else
                        $location.path("/c/"+$scope.community+"");
                }
            }
            
            $scope.menu = 'frontpage';
            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);