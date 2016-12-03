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
            $scope.activeView = $location.url().split('/')[2];
            $scope.rootTxHash = $location.url().split('/')[4];
            $scope.hasVoted = true;
            
            
            $scope.comments = Community.getChildren($scope.activeView, $scope.txHash);
            
            var async_eventData = Community.getEventData($scope.txHash).then(
            function(event){
                $scope.event = event;
                
                var ipfsHash = event.args.ipfsHash;
                var communityName = event.args.shardName;
                
                var async_ipfsData = IpfsService.getIpfsData(ipfsHash).then(
                function(ipfsData){
                    $scope.comments = Community.getChildren(communityName,event.transactionHash);
                    $scope.post = ipfsData;
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,event.transactionHash);
                    console.log($scope.hasVoted);
                }, function(err){
                    console.error(err); 
                });

                $scope.mouseoverExtras = function(){
                    $scope.hovered = true;
                };

                $scope.borderWidth = 0;
                $scope.borderTop = 4;
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
                    ProfileDB.upvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };

                $scope.downvote = function(){
                    ProfileDB.downvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };
            }, function(err){
                console.error(err);    
            });
		}
	}
}]);