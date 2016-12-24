Community.directive('videoFrame', ['$sce',
function($sce) {
	return {
		restrict: 'E',
		scope: {
            url: '=',
		},
		replace: true,
		templateUrl: 'directives/video-frame/videoFrameDirective.html',
		controller: function($scope){
            //console.log($scope.url);
            //$scope.videoSource = $sce.trustAsResourceUrl($scope.url); *disabled*
            
        },
		link : function($scope, $element, $attrs) {
        
        }
	}
}]);