app.directive('sidenavLeft', ['$web3','$mdMedia', function($web3, $mdMedia) {
	return {
		restrict: 'E',
		replace: false,
		templateUrl: 'directives/sidenav-left/sidenav-left.directive.html',
		controller: function($scope){

		}
	}
}]);