Community.directive('commentCard', [ 
function() {
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
            //console.log($scope.commentUrl);
		}
	}
}]);