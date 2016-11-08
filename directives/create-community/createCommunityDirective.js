Community.directive('createCommunity', [
function() {
	return {
		restrict: 'E',
		scope: {
            created:'='
		},
		replace: true,
		templateUrl: 'directives/create-community/createCommunityDirective.html',
		controller: function($scope){
            
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);