Community.directive('focusOnShow', ['$timeout', 
function($timeout) {
	return {
		restrict: 'A',
		link : function($scope, $element, $attrs) {
            if($attrs.ngShow){
                $scope.$watch($attrs.ngShow, function(val){
                    if(val){
                        $timeout(function(){
                            $element[0].focus();
                        },0);
                    }
                });
            }
		}
	}
}]);