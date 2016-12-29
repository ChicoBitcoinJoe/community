Community.directive('commentCard', ['$location','RecursionHelper','Community','IpfsService','ProfileDB','VoteHub','Web3Service',
function($location,RecursionHelper,Community,IpfsService,ProfileDB,VoteHub,Web3Service) {
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
            $scope.hasPrivateVoted = false;
            $scope.isComment = false;
            $scope.comments = Community.getChildren($scope.activeView, $scope.txHash);
            
            var async_eventData = Community.getEventData($scope.txHash).then(
            function(event){
                $scope.event = event;
                $scope.communityName = event.args.channel;
                
                $scope.user = ProfileDB.getUser($scope.event.args.sender);
                
                var ipfsHash = $scope.event.args.hash;
                var async_ipfsData = IpfsService.getIpfsData(ipfsHash).then(
                function(ipfsData){
                    //console.log($scope.communityName,$scope.event.transactionHash);
                    $scope.comments = Community.getChildren($scope.communityName,$scope.event.transactionHash);
                    $scope.post = ipfsData;
                    $scope.hasPrivateVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                    //console.log($scope.post.poster);
                    if(Community.commentIsValid(ipfsData))
                        $scope.isComment = true;
                    
                }, function(err){
                    console.error(err); 
                });

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

                $scope.privateUpvote = function(){
                    ProfileDB.upvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    $scope.hasPrivateVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };

                $scope.privateDownvote = function(){
                    ProfileDB.downvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    $scope.hasPrivateVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };
                
                $scope.publicUpvote = function(){
                    VoteHub.getUserData(Web3Service.getCurrentAccount(),$scope.activeView).then(
                    function(data){
                        var tokenAmount = Math.round(data[0]*1/10);
                        VoteHub.vote($scope.activeView,$scope.txHash,tokenAmount,true).then(
                        function(receipt){
                            $scope.hasPublicVoted = true;
                        });
                    });
                };

                $scope.publicDownvote = function(){
                    VoteHub.getUserData(Web3Service.getCurrentAccount(),$scope.activeView).then(
                    function(data){
                        var tokenAmount = Math.round(data[0]/10);
                        VoteHub.vote($scope.activeView,$scope.txHash,tokenAmount,false).then(
                        function(receipt){
                            $scope.hasPublicVoted = true;
                        });
                    });
                };
                
                $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                
                $scope.save = function(){
                    console.log($scope.communityName, $scope.txHash);
                    ProfileDB.saveToFavorites($scope.communityName, $scope.txHash);
                    $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                };
                
                $scope.unsave = function(){
                    ProfileDB.removeFromFavorites($scope.communityName, $scope.txHash);
                    $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                };
                
                $scope.voteIsPrivate = false;
                
            }, function(err){
                console.error(err);    
            });
		}
	}
}]);