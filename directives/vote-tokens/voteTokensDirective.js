Community.directive('voteTokens', ['VoteHub',
function(VoteHub){
	return {
		restrict: 'E',
		scope: {
            account: '=',
            community: '='
		},
		replace: true,
		templateUrl: 'directives/vote-tokens/voteTokensDirective.html',
		controller: function($scope){
            //console.log($scope.account, $scope.community);
            var interval = setInterval(function(){
                if($scope.account){
                    VoteHub.getUserData($scope.account,$scope.community).then(
                    function(userData){
                        $scope.available = web3.fromWei(userData[0], 'szabo').toString()/10;
                        $scope.total = web3.fromWei(userData[1], 'szabo').toString()/10;
                    }, function(err){
                        console.error(err);
                    });
                    
                    clearInterval(interval);
                }   
            }, 100);
        },
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);