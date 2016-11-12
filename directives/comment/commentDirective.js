Community.directive('commentCard', ['$location','RecursionHelper','LinkDB','ProfileDB','IpfsService',
function($location,RecursionHelper,LinkDB,ProfileDB,IpfsService) {
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
            console.log($scope.ipfsHash,$scope.commentDepth);
            
            $scope.post = IpfsService.getIpfsData($scope.ipfsHash).then(
            function(ipfsData){
                $scope.post = ipfsData;
            }, function(err){
                console.error(err); 
            });
            
            $scope.comments = ['QmSnK24E4E9c8tCsc866NU7Q2hpUhQnCsa2ZuJHBUDbgSm','QmSnK24E4E9c8tCsc866NU7Q2hpUhQnCsa2ZuJHBUDbgSm','QmSnK24E4E9c8tCsc866NU7Q2hpUhQnCsa2ZuJHBUDbgSm']; //LinkDB.getComments($scope.ipfsHash);
            
            $scope.borderWidth = 0;
            $scope.borderTop = 4;
            $scope.marginLeft = 8;
            $scope.marginBottom = 8;
            $scope.marginRight = 8;
            $scope.paddingLeft = 0;
            
            if($scope.commentDepth > 0){
                $scope.borderTop = 8;
                $scope.marginLeft = 0;
                $scope.marginBottom = 4;
                $scope.paddingLeft = 4;
                $scope.marginRight = 0;
            }
            
            if($scope.commentDepth > 1){
                $scope.borderWidth = 4;
                $scope.borderTop = 4;
            }
            
            $scope.showExtras = false;
		}
	}
}]);