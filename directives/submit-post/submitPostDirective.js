Community.directive('submitPost', ['ProfileDB','$location','Community', function(ProfileDB,$location, Community) {
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
                if($scope.newPost.postType === 'image'){
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
                    
                    $scope.img.src = $scope.newPost.postLink;
                }
            }, 1000);
            
            $scope.submitButtonText = "Click Here To Post";
            $scope.submitPost = function(){
                console.log($scope.newPost);
                $scope.submitButtonText = "Waiting for Post to be Broadcast";
                Community.submitPost($scope.newPost).then(
                function(ipfsHash){
                    if(ipfsHash){
                        console.log(ipfsHash);
                        $location.url('c/'+ $scope.community + /post/ + ipfsHash);
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