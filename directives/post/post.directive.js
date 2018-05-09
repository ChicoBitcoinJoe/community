app.directive('post', ['$web3','$mdMedia','NameService', function($web3, $mdMedia, Names) {
	return {
		restrict: 'E',
		replace: false,
		templateUrl: 'directives/post/post.directive.html',
		scope: {
			post: '=',
		},
		controller: function($scope){
			$scope.whois = Names.get;

			$scope.followLink = function(link){
				console.log(link);
			}
		}
	}
}]);