Community.directive('sidenavRight', ['$mdSidenav',
function($mdSidenav) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/sidenav-right/sidenavRightDirective.html',
		controller: function($scope, $mdSidenav){
            $scope.publicOpinionWeight = 50;
            $scope.lookBackDays = 30;
            $scope.isDisabled = false;
        },
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);