Community.directive('commentCard', ['$location','RecursionHelper','Community','IpfsService','ProfileDB','VoteHub','Web3Service',
function($location,RecursionHelper,Community,IpfsService,ProfileDB,VoteHub,Web3Service) {
	return {
		restrict: 'E',
		scope: {
			commentData: '=',
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
            //console.log($scope.commentData);
            $scope.txHash = $scope.commentData.txHash;
            
            $scope.activeView = $location.url().split('/')[2];
            $scope.rootTxHash = $location.url().split('/')[4];
            $scope.hasPrivateVoted = false;
            $scope.isComment = false;
            $scope.minimized = true;
            
            if($scope.commentDepth == 0)
                Community.getPosts([$scope.activeView]);
            
            $scope.children = [];
            $scope.comments = Community.getChildren($scope.activeView, $scope.txHash);
            for(child in $scope.comments){
                $scope.children.push({txHash:$scope.comments[child],combinedScore:50});
            }
            
            var async_eventData = Community.getEventData($scope.txHash).then(
            function(event){
                $scope.event = event;
                $scope.communityName = event.args.channel;
                
                $scope.user = ProfileDB.getUser($scope.event.args.sender);
                $scope.privateScore = $scope.user.score;
                
                $scope.userUpvoted = true;
                $scope.userDownvoted = true;
                VoteHub.getUserVotes(Web3Service.getCurrentAccount(), $scope.communityName, $scope.event.args.sender).then(
                function(voteData){
                    var upvotes = web3.fromWei(voteData[0],'szabo').toString()/10;
                    var downvotes = web3.fromWei(voteData[1],'szabo').toString()/10;
                    
                    if(upvotes == 0)
                        $scope.userUpvoted = false;
                    
                    if (downvotes == 0)
                        $scope.userDownvoted = false;
    
                }, function(err){
                    console.error(err);
                });
                
                VoteHub.getKeyVotes($scope.communityName,$scope.event.args.sender).then(
                function(voteData){
                    var upvotes = web3.fromWei(voteData[0],'szabo').toString()/10;
                    var downvotes = web3.fromWei(voteData[1],'szabo').toString()/10;
                    //console.log(upvotes,downvotes);
                    if(upvotes+downvotes !== 0){
                        console.log(upvotes,downvotes);
                        $scope.publicScore = Math.round(100*upvotes/(upvotes+downvotes));
                        //console.log($scope.publicScore,$scope.user.score);
                        $scope.commentData.combinedScore = ($scope.publicScore+$scope.user.score)/2;
                    } else {
                        console.log($scope.privateScore);
                        $scope.publicScore = '*';
                        $scope.commentData.combinedScore = $scope.privateScore;
                    }
                    
                    console.log($scope.commentDepth, $scope.commentData.combinedScore, $scope.minimized);
                    
                    if($scope.commentData.combinedScore >= 25 && $scope.user.score >= 25 )
                        $scope.minimized = false;

                    if($scope.commentDepth == 0)
                        $scope.minimized = false;
                    
                    if($scope.user.squelched || $scope.user.banned)
                        $scope.hidden = true;
                    
                    
                    console.log($scope.commentDepth, $scope.commentData.combinedScore, $scope.minimized);
                    
                    $scope.$watch('children',
                    function(oldChildren,newChildren){
                        //console.log(oldChildren,newChildren);
                    });
                }, function(err){
                    console.error(err);
                });
                
                var ipfsHash = $scope.event.args.hash;
                var async_ipfsData = IpfsService.getIpfsData(ipfsHash).then(
                function(ipfsData){
                    //console.log($scope.communityName,$scope.event.transactionHash);
                    $scope.post = ipfsData;
                    $scope.comment = marked($scope.post.comment);
                    $scope.hasPrivateVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                    //console.log($scope.post.poster);
                    if(Community.commentIsValid(ipfsData))
                        $scope.isComment = true;
                    console.log($scope.isComment);
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
                        VoteHub.vote($scope.activeView,$scope.event.args.sender,tokenAmount,true).then(
                        function(receipt){
                            $scope.userDownvoted = false;
                        });
                    });
                };

                $scope.publicDownvote = function(){
                    VoteHub.getUserData(Web3Service.getCurrentAccount(),$scope.activeView).then(
                    function(data){
                        var tokenAmount = Math.round(data[0]/10);
                        VoteHub.vote($scope.activeView,$scope.event.args.sender,tokenAmount,false).then(
                        function(receipt){
                            $scope.userUpvoted = false;
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
                
                $scope.hide = function(){
                    $scope.hidden = true;
                };
            }, function(err){
                console.error(err);    
            });
            
            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };
        }
	}
}]);