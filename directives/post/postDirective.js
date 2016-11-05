Community.directive('postCard', [ 
function() {
	return {
		restrict: 'E',
		scope: {
            postUrl: '=',
		},
		replace: true,
		templateUrl: 'directives/post/postDirective.html',
		controller: function($scope){
            var img = new Image();
            img.onload= function() {
                console.log("Image loaded");
                if(this.width > this.height){
                    $scope.orientation = 'horizontal';
                    $scope.layout= 'column';
                } else {
                    $scope.orientation = 'vertical';
                    $scope.layout = 'row';
                }

                $scope.$apply();
            }
            
            img.src = $scope.postUrl;
		},
		link : function($scope, $element, $attrs) {
            //console.log($scope.postUrl);
            
		}
	}
}]);