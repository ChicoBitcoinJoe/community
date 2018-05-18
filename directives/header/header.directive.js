app.directive('header', ['$web3','$mdMedia', function($web3, $mdMedia) {
	return {
		restrict: 'E',
		replace: false,
		templateUrl: 'directives/header/header.directive.html',
		controller: function($scope){
			$scope.$mdMedia = $mdMedia;
		}
	}
}]);