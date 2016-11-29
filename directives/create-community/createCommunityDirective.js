Community.directive('createCommunity', ['Community','$q',
function(Community,$q) {
	return {
		restrict: 'E',
		scope: {
            community:'=',
            created:'='
		},
		replace: true,
		templateUrl: 'directives/create-community/createCommunityDirective.html',
		controller: function($scope){
            $scope.buttonState = "Create " + $scope.community;
            $scope.clicked = false;
            $scope.createCommunity = function(community){
                if(!$scope.clicked){
                    $scope.buttonState = "Please wait while " + $scope.community + " is being created!";
                    $scope.clicked = true;
                    Community.createCommunity(community).then(
                    function(contractAddress){
                        console.log($scope.community + " deployed to ", contractAddress);
                        $scope.created = true;
                    },function(error){
                        $scope.buttonState = "Error creating " + $scope.community + ". Click to try again...";
                        $scope.clicked = false;
                        console.error(error);
                    });
                }
            };
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);