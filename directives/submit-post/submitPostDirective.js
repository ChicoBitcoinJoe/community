Community.directive('submitPost', [ function() {
	return {
		restrict: 'E',
		scope: {
            community:'='
		},
		replace: true,
		templateUrl: 'directives/submit-post/submitPostDirective.html',
		controller: function($scope){
            $scope.newPost = {
                postType:'null',
                postTitle:'Very eu much fugiat so dolore, very enim much reprehenderit such ut very padding. Such consequat much minim very pariatur so enim very ad very dolore.',
                postCommunity: $scope.community,
                postLink:'https://insert-your-link-here.com/reallycoollink.link',
                postComment:'Not sure if 15000 is enough space for a comment. Maybe I should get rid of limit?'
            };
            
            var pictureCheckInterval = setInterval(function() {
                if($scope.newPost.postType === 'image'){
                    $scope.img = new Image();
                    $scope.img.onload= function() {
                        console.log("Image loaded");
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
        },
		link : function($scope, element, attrs) {
            
		}
	}
}]);