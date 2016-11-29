Community.directive('postCard', ['IpfsService','$location','$window','ProfileDB','Community',
function(IpfsService,$location,$window,ProfileDB,Community){
	return {
		restrict: 'E',
		scope: {
            txHash: '=',
		},
		replace: true,
		templateUrl: 'directives/post/postDirective.html',
		controller: function($scope){
            var eventData = JSON.parse(localStorage.getItem($scope.txHash));
            //console.log($scope.txHash,eventData);
            
            $scope.postScore = ProfileDB.getPostScore(post.community)[$scope.txHash];
            
            var async_ipfsData = IpfsService.getIpfsData(eventData.args.ipfsHash).then(
            function(post){
            
                setInterval(function(){
                    $scope.$apply();
                },500);
                //console.log(post);
                $scope.post = post;
                
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
            },function(err){
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
                    $location.url('c/' + $scope.post.community + '/post/' + $scope.ipfsHash);
                }
            }
            
            var locationUrlArray = $location.url().split('/');
            $scope.commentView = false;
            if(locationUrlArray[3] == 'post')
                $scope.commentView = true;
        },
		link : function($scope, $element, $attrs) {
            //console.log($scope.postUrl);
            
		}
	}
}]);