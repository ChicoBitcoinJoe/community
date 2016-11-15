Community.directive('commentCard', ['$location','RecursionHelper','Community','IpfsService',
function($location,RecursionHelper,Community,IpfsService) {
	return {
		restrict: 'E',
		scope: {
			ipfsHash: '=',
            commentDepth: '='
		},
		replace: true,
		templateUrl: 'directives/comment/commentDirective.html',
        compile: function(element) {
            return RecursionHelper.compile(element, function($scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        },
		controller: function($scope){
            $scope.activeView = $location.url().split('/')[2];
            console.log($scope.activeView,$scope.ipfsHash,$scope.commentDepth);
            
            $scope.comments1 = Community.getChildren($scope.activeView, $scope.ipfsHash).comments;
            console.log($scope.comments1);
            
            $scope.comments = Community.getChildren($scope.activeView, $scope.ipfsHash).comments[$scope.ipfsHash];
            console.log($scope.comments);
            
            var promise = IpfsService.getIpfsData($scope.ipfsHash).then(
            function(ipfsData){
                $scope.post = ipfsData;
            }, function(err){
                console.error(err); 
            });
            
            $scope.borderWidth = 0;
            $scope.borderTop = 8;
            $scope.marginLeft = 8;
            $scope.marginBottom = 8;
            $scope.marginRight = 8;
            $scope.paddingLeft = 0;
            
            $scope.showExtras = true;
            
            if($scope.commentDepth > 0){
                $scope.marginLeft = 0;
                $scope.marginBottom = 0;
                $scope.marginRight = 0;
                $scope.paddingLeft = 4;
                
                $scope.showExtras = false;
            }
            
            if($scope.commentDepth > 1){
                $scope.borderWidth = 4;
                $scope.borderTop = 4;
            }
		}
	}
}]);