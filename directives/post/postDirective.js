Community.directive('postCard', ['IpfsService','$location','$window','ProfileDB','Community','VoteHub',
function(IpfsService,$location,$window,ProfileDB,Community,VoteHub){
	return {
		restrict: 'E',
		scope: {
            postData: '=',
		},
		replace: true,
		templateUrl: 'directives/post/postDirective.html',
		controller: function($scope){
            //console.log($scope.postData);
            $scope.txHash = $scope.postData.txHash;
            
            $scope.isPost = false;
            $scope.isSaved = false;
            $scope.activeView = $location.url().split('/')[2];
            
            var async_eventData = Community.getEventData($scope.txHash).then(
            function(event){
                //console.log(args);
                $scope.event = event;
                $scope.communityName = event.args.channel;
                
                $scope.isSaved = ProfileDB.isFavorited($scope.communityName,$scope.txHash);
                $scope.privateScore = Community.getPostScore($scope.communityName,$scope.txHash);
                
                var ipfsHash = $scope.event.args.hash;
                var async_ipfsData = IpfsService.getIpfsData(ipfsHash).then(
                function(post){
                    //console.log(post);
                    $scope.post = post;
                    
                    VoteHub.getKeyVotes($scope.communityName,$scope.txHash).then(
                    function(voteData){
                        var upvotes = web3.fromWei(voteData[0], 'szabo').toString()/10;
                        var downvotes = web3.fromWei(voteData[1], 'szabo').toString()/10;
                        //console.log(upvotes,downvotes);
                        if(upvotes+downvotes !== 0){
                            $scope.publicScore = Math.round(100*upvotes/(upvotes+downvotes));
                            $scope.postData.combinedScore = ($scope.publicScore+$scope.privateScore)/2;
                            
                            //console.log($scope.postData);
                        } else {
                            $scope.publicScore = ' * ';
                            $scope.postData.combinedScore = $scope.privateScore;
                        }
                    }, function(err){
                        console.error(err);
                    });
                    
                    if($scope.post.media == 'image'){
                        var img = new Image();
                        img.onload= function() {
                            //console.log("Image loaded");
                            if(this.width > this.height){
                                $scope.orientation = 'horizontal';
                                $scope.layout= 'column';
                            } else {
                                $scope.orientation = 'vertical';
                                $scope.layout = 'row';
                            }
                        }

                        var url;
                        if($scope.post.link){
                            var slice = $scope.post.link.slice(0,2);
                            //console.log($scope.post.link);
                            if(slice === 'Qm'){
                                var absUrl = $location.absUrl();
                                var index = absUrl.indexOf('ipfs');
                                var urlSlice = absUrl.slice(0,index+5);
                                url = urlSlice + $scope.post.link;
                            } else {
                                url = $scope.post.link;
                            }
                        }
                        img.src = url;

                        var slice = $scope.post.link.slice(0,2);
                        if(slice === 'Qm'){
                            var url = $location.absUrl().split('/');
                            $scope.imageSource = url[0] + '//' + url[2] + '/' + url[3] + '/' + $scope.post.link;
                            //console.log($scope.imageSource);
                        } else {
                            $scope.imageSource = $scope.post.link;
                        }
                    } else if($scope.post.media === 'video'){
                        var url = $scope.post.link;
                        //console.log(url);

                        function getParm(url, base) {
                            var re = new RegExp("(\\?|&)" + base + "\\=([^&]*)(&|$)");
                            var matches = url.match(re);
                            if (matches) {
                                return(matches[2]);
                            } else {
                                return("");
                            }
                        }

                        var retVal = {};
                        var matches;

                        if (url.indexOf("youtube.com/watch") != -1) {
                            retVal.provider = "youtube";
                            retVal.id = getParm(url, "v");
                        } else if (matches = url.match(/vimeo.com\/(\d+)/)) {
                            retVal.provider = "vimeo";
                            retVal.id = matches[1];
                        }

                        //console.log(retVal);
                        if(retVal.provider == 'youtube')
                            $scope.videoSourceUrl = 'https://www.youtube.com/v/' + retVal.id + '&rel=0';
                        else if(retVal.provider == 'vimeo')
                            $scope.videoSourceUrl = 'https://www.vimeo.com/' + retVal.id;

                        //console.log($scope.videoSourceUrl);
                    }
                    
                    var locationUrlArray = $location.url().split('/');
                        $scope.commentView = false;
                        if(locationUrlArray[3] == 'post')
                            $scope.commentView = true;
                    
                    $scope.isPost = Community.postIsValid($scope.post);
                    
                },function(err){
                    console.error(err);
                });           
            }, function(err){
                console.error(err);    
            });
            
            $scope.followLink = function(){
                if($scope.post.link){
                    var slice = $scope.post.link.slice(0,2);
                    console.log($scope.post.link);
                    if(slice === 'Qm'){
                        var absUrl = $location.absUrl();
                        var index = absUrl.indexOf('ipfs');
                        var urlSlice = absUrl.slice(0,index+5);
                        var url = urlSlice + $scope.post.link;
                        $window.open(url);
                    } else {
                        var url = $location.url();
                        $window.open($scope.post.link);
                    }
                } else {
                    console.log("self post");
                    $location.url('c/' + $scope.post.community + '/post/' + $scope.txHash);
                }
            };
            
            
            $scope.save = function(){
                console.log("Saving");
                console.log($scope.communityName, $scope.txHash);
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
        },
		link : function($scope, $element, $attrs) {
            //console.log($scope.postUrl);
            
		}
	}
}]);