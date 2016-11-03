Community.directive('toolbar', ['$mdSidenav', '$location', 
function($mdSidenav, $location) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/toolbar/toolbarDirective.html',
		controller: function($scope, $mdSidenav){
            $scope.toggle = function(id) { $mdSidenav(id).toggle(); };
            var url = $location.url().split('/');
            if(url[1] === 'm' || url[1] === 'c')
                $scope.header = url[2];
            else   
                $scope.header = url[1];
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);