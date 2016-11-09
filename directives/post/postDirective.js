Community.directive('postCard', ['IpfsService','$location',
function(IpfsService,$location) {
	return {
		restrict: 'E',
		scope: {
            event: '=',
		},
		replace: true,
		templateUrl: 'directives/post/postDirective.html',
		controller: function($scope){
            //console.log($scope.event);
            
            $scope.post = IpfsService.getIpfsData($scope.event.args.metadata).then(
            function(ipfsData){
                $scope.post = ipfsData;
                
                if($scope.post.postType === 'image'){
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

                        $scope.$apply();
                    }
                    img.src = $scope.post.postLink;

                    var slice = $scope.post.postLink.slice(0,2);
                    if(slice === 'Qm'){
                        var url = $location.absUrl().split('/');
                        $scope.imageSource = url[0] + '//' + url[2] + '/' + url[3] + '/' + $scope.post.postLink;
                    } else {
                        $scope.imageSource = $scope.post.postLink;
                    }
                } else if($scope.post.postType === 'video'){
                    var url = $scope.post.postLink;
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
        },
		link : function($scope, $element, $attrs) {
            //console.log($scope.postUrl);
            
		}
	}
}]);