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
                //console.log(event);
                var ipfsHash;
                var communityName;
                console.log(event);
                //This is an event from X (geth or parity?)
                if(Object.keys(event).indexOf('args') !== -1){
                    ipfsHash = event.args.ipfsHash;
                    communityName = event.args.shardName;
                } //This is an event from Y (geth or parity?) 
                else if(Object.keys(event).indexOf('data') !== -1){
                    //This is going to cause bugs Guaranteed!!!
                    //Needs a better solution asap
                    var data = event.data;//.slice(2,length).replace(/^0+/, '');
                    var tempIpfsHash = web3.toAscii(data);
                    var index = tempIpfsHash.indexOf('Qm');
                    var length = tempIpfsHash.length;
                    ipfsHash = tempIpfsHash.slice(index,index+46);

                    var tempCommunityName = web3.toAscii(data);
                    var tindex = tempCommunityName.indexOf('@');
                    var windex = tempCommunityName.indexOf('Qm');
                    tempCommunityName = tempCommunityName.slice(tindex+1,windex-1);
                    tempCommunityName = JSON.stringify(tempCommunityName).replace(/\\u0000/g, "");
                    tempCommunityName = tempCommunityName.replace(/\\t/g, "");
                    var length = tempCommunityName.length;
                    tempCommunityName = tempCommunityName.slice(1,length-1);
                    communityName = tempCommunityName;
                } else {
                    console.error("Cannot recognize event data");
                }

                console.log(communityName);
                
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
                    ProfileDB.upvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    Community.updatePostScore($scope.activeView,$scope.event.transactionHash);
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };

                $scope.downvote = function(){
                    ProfileDB.downvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    Community.updatePostScore($scope.activeView,$scope.event.transactionHash);
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };
            }, function(err){
                console.error(err);    
            });
		}
	}
}]);