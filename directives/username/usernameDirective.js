Community.directive('username', ['NameService',
function(NameService){
	return {
		restrict: 'E',
		scope: {
            account: '=',
            unique: '='
		},
		replace: true,
		templateUrl: 'directives/username/usernameDirective.html',
		controller: function($scope){
            $scope.username = "Anonymous";
            
            NameService.getName($scope.account).then(
            function(username){
                $scope.username = username;
            }, function(err){
                console.log(err);
            });
        },
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);