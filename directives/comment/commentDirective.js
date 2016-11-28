Community.directive('commentCard', ['$location','RecursionHelper','Community','IpfsService','ProfileDB',
function($location,RecursionHelper,Community,IpfsService,ProfileDB) {
	return {
		restrict: 'E',
		scope: {
			txHash: '=',
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
            $scope.eventData = JSON.parse(localStorage.getItem($scope.txHash));
            //console.log($scope.txHash,$scope.eventData);
            $scope.ipfsHash = $scope.eventData.args.ipfsHash;
            $scope.activeView = $location.url().split('/')[2];
            $scope.rootTxHash = $location.url().split('/')[4];
            $scope.comments = Community.getChildren($scope.activeView, $scope.txHash);
            $scope.hasVoted = true;
            
            var async_ipfsData = IpfsService.getIpfsData($scope.ipfsHash).then(
            function(ipfsData){
                $scope.post = ipfsData;
                $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.eventData.transactionHash);
            }, function(err){
                console.error(err); 
            });
            
            $scope.mouseoverExtras = function(){
                $scope.hovered = true;
            };
            
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
            
            $scope.show = false;
            $scope.replyText = "Reply";
            $scope.showSubmitCommentPanel = function(){
                $scope.show = !$scope.show;
                if($scope.show){
                    $scope.replyText = "Close";
                } else {
                    $scope.replyText = "Reply";   
                }
                
                return $scope.show;
            };
            
            $scope.upvote = function(){
                ProfileDB.upvote($scope.activeView, $scope.post.poster, $scope.rootTxHash);
                Community.updatePostScore($scope.activeView,$scope.rootTxHash);
                $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.rootTxHash);
            };
            
            $scope.downvote = function(){
                ProfileDB.downvote($scope.activeView, $scope.post.poster, $scope.eventData.transactionHash);
                Community.updatePostScore($scope.activeView,$scope.eventData.transactionHash);
                $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.eventData.transactionHash);
            };
		}
	}
}]);