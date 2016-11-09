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
            $scope.videoSource = $sce.trustAsResourceUrl($scope.url);
            //console.log($scope.video.Source);
        },
		link : function($scope, $element, $attrs) {
            //console.log($scope.postUrl);
            
		}
	}
}]);