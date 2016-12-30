Community.directive('submitPost', ['ProfileDB','$location','Community', 
function(ProfileDB,$location,Community) {
	return {
		restrict: 'E',
		scope: {
            community:'='
		},
		replace: true,
		templateUrl: 'directives/submit-post/submitPostDirective.html',
		controller: function($scope){
            $scope.newPost = {
                poster: ProfileDB.getCurrentAccount(),
                media: 'null',
                title: null,
                community: $scope.community,
                link: null,
                comment: null
            };
            
            var pictureCheckInterval = setInterval(function() {
                if($scope.newPost.media === 'image'){
                    $scope.img = new Image();
                    $scope.img.onload= function() {
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
                     
                    var url;
                    if($scope.newPost.link){
                        var slice = $scope.newPost.link.slice(0,2);
                        //console.log($scope.newPost.link);
                        if(slice === 'Qm'){
                            var absUrl = $location.absUrl();
                            var index = absUrl.indexOf('ipfs');
                            var urlSlice = absUrl.slice(0,index+5);
                            url = urlSlice + $scope.newPost.link;
                        } else {
                            url = $scope.newPost.link;
                        }
                    }

                    var slice = $scope.newPost.link.slice(0,2);
                    if(slice === 'Qm'){
                        var url = $location.absUrl().split('/');
                        $scope.imageSource = url[0] + '//' + url[2] + '/' + url[3] + '/' + $scope.newPost.link;
                    } else {
                        $scope.imageSource = $scope.newPost.link;
                    }
                    
                    $scope.img.src = $scope.imageSource;
                }
            }, 1000);
            
            $scope.$on('$routeChangeSuccess', function(newHeader) {
                clearInterval(pictureCheckInterval);
            });
            
            $scope.submitButtonText = "Click Here To Post";
            $scope.submitPost = function(){
                console.log($scope.newPost);
                $scope.submitButtonText = "Waiting for Post to be Broadcast";
                Community.submitPost($scope.newPost).then(
                function(txHash){
                    if(txHash){
                        console.log(txHash);
                        $location.url('c/'+ $scope.community + /post/ + txHash);
                    } else {
                        console.log('Not a valid post. Aborting.');
                    }
                }, function(err){
                    $scope.submitButtonText = "Oops! An error occured...";
                    console.error(err);
                });
                clearInterval(pictureCheckInterval);
            };
        },
		link : function($scope, element, attrs) {
            
		}
	}
}]);