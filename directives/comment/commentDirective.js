Community.directive('commentCard', [ 
function($location,ProfileDB,IpfsService,AutoModerator) {
	return {
		restrict: 'E',
		scope: {
            commentUrl: '='
		},
		replace: true,
		templateUrl: 'directives/comment/commentDirective.html',
		controller: function($scope){
            $scope.showDetails = false;
		},
		link : function($scope, $element, $attrs) {
            console.log($scope.postUrl);
		}
	}
}]);