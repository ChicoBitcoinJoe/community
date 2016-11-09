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
                postType: 'null',
                postTitle: '',
                postCommunity: $scope.community,
                postLink: '',
                postComment: ''
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
            
            $scope.submitPost = function(){
                console.log($scope.newPost);
                Community.submitPost($scope.newPost).then(
                function(txHash){
                    if(txHash){
                        
                        $location.url('c/'+ $scope.community + /tx/ + txHash);
                    } else {
                        console.log('Not a valid post. Aborting.');
                    }
                }, function(error){
                    console.error(err);
                });
                clearInterval(pictureCheckInterval);
            };
        },
		link : function($scope, element, attrs) {
            
		}
	}
}]);