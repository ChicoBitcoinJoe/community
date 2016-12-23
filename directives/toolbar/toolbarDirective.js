Community.directive('toolbar', ['$mdSidenav', '$location', 'ProfileDB',
function($mdSidenav, $location, ProfileDB) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/toolbar/toolbarDirective.html',
		controller: function($scope, $mdSidenav){
            console.log('Loading toolbar');
            
            var locationUrlArray = $location.url().split('/');
            $scope.viewType = locationUrlArray[1];
            $scope.activeView = locationUrlArray[2];
            
            $scope.community = $scope.activeView;
            
            $scope.hideExtras = false;
            if($scope.viewType == 'profile'){
                $scope.community = 'Profile';
                $scope.hideExtras = true;
            } else if($scope.viewType == 'homepage'){
                $scope.community = 'Home';
                $scope.hideExtras = true;
            }
            
            if($scope.viewType == 'c' && ProfileDB.communityIsSaved($scope.activeView))
                $scope.star = "star";
            else if($scope.viewType == 'm' && ProfileDB.multiIsSaved($scope.activeView))
                $scope.star = "star";
            else
                $scope.star = "star_border";
            
            $scope.$on('headerChange', function(event, newHeader) {
                var locationUrlArray = $location.url().split('/');
                $scope.viewType = locationUrlArray[1];
                $scope.activeView = locationUrlArray[2];
                
                $scope.community = $scope.activeView;
            
                $scope.hideExtras = false;
                if($scope.viewType == 'profile'){
                    $scope.community = 'Profile';
                    $scope.hideExtras = true;
                } else if($scope.viewType == 'homepage'){
                    $scope.community = 'Home';
                    $scope.hideExtras = true;
                }
                
                if($scope.viewType == 'c' && ProfileDB.communityIsSaved($scope.activeView))
                    $scope.star = "star";
                else if($scope.viewType == 'm' && ProfileDB.multiIsSaved($scope.activeView))
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
                    ProfileDB.addCommunity($scope.activeView,'all');
                    $scope.star = "star";
                } else if($scope.viewType == 'm'){
                    $scope.$apply(function(){
                        ProfileDB.createMulti($scope.activeView);
                        $scope.star = "star";
                    });
                }
                
            }
            
            $scope.goTo = function(option){
                console.log(option);
                if(option != $scope.menu){
                    if(option = 'favorites')
                        $location.path("/c/"+$scope.activeView+"/favorites");
                    else
                        $location.path("/c/"+$scope.activeView+"");
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