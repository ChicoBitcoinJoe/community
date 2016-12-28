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
            var interval = setInterval(function(){
                if($scope.account){
                    NameService.getName($scope.account).then(
                    function(username){
                        $scope.username = username;
                        $scope.partial = $scope.account.slice(2,6);
                        clearInterval(interval);
                    }, function(err){
                        console.log(err);
                    });
                    
                }   
            }, 100);
        },
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);