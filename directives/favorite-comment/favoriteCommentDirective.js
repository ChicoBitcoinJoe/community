Community.directive('favoriteCommentCard', ['$location','RecursionHelper','Community','IpfsService','ProfileDB',
function($location,RecursionHelper,Community,IpfsService,ProfileDB) {
	return {
		restrict: 'E',
		scope: {
			commentData: '='
		},
		replace: true,
		templateUrl: 'directives/favorite-comment/favoriteCommentDirective.html',
        compile: function(element) {
            return RecursionHelper.compile(element, function($scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        },
		controller: function($scope){
            console.log($scope.commentData);
            if(!$scope.commentData){
                var locationUrlArray = $location.url().split('/');
                $scope.txHash = locationUrlArray[4];
            } else 
                $scope.txHash = $scope.commentData.txHash;
            
            $scope.isComment = false;
            var async_eventData = Community.getEventData($scope.txHash).then(
            function(event){
                $scope.event = event;
                $scope.communityName = event.args.channel;
                
                $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                
                var ipfsHash = $scope.event.args.hash;
                var async_ipfsData = IpfsService.getIpfsData(ipfsHash).then(
                function(ipfsData){
                    if(Community.commentIsValid(ipfsData)){
                        $scope.isComment = true;
                        $scope.comments = Community.getChildren($scope.communityName,$scope.event.transactionHash);
                        $scope.post = ipfsData;
                        $scope.comment = marked($scope.post.comment);
                        $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                        //console.log($scope.post.poster);
                    }
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


                $scope.goToPost = function(){
                    var rootTxHash = $scope.post.rootParent;
                    var url = 'c/'+$scope.event.args.shardName+'/post/'+rootTxHash;
                    console.log(url);
                    $location.url(url);
                };

                $scope.upvote = function(){
                    ProfileDB.upvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };

                $scope.downvote = function(){
                    ProfileDB.downvote($scope.activeView, $scope.post.poster, $scope.event.transactionHash);
                    $scope.hasVoted = ProfileDB.hasVoted($scope.post.poster,$scope.event.transactionHash);
                };
                
                
                $scope.save = function(){
                    console.log("Saving");
                    ProfileDB.saveToFavorites($scope.communityName, $scope.txHash);
                    $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                    console.log($scope.isSaved);
                };
                
                $scope.unsave = function(){
                    console.log("Unsaving");
                    ProfileDB.removeFromFavorites($scope.communityName, $scope.txHash);
                    $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                    console.log($scope.isSaved);
                };
            }, function(err){
                console.error(err);    
            });
		}
	}
}]);