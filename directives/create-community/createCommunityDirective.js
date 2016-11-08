Community.directive('createCommunity', ['LinkDB','$q','$window',
function(LinkDB,$q,$window) {
	return {
		restrict: 'E',
		scope: {
            community:'='
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
                    LinkDB.createShard(community).then(function(txHash){
                        console.log('txHash',txHash);
                        $scope.filter = web3.eth.filter('latest', function(err, blockHash) {
                            var deferred = $q.defer();
                            var async_reciept = web3.eth.getTransactionReceipt(txHash, 
                            function(err,receipt){
                                if(!err){
                                    //console.log('reciept', receipt);
                                    if(receipt !== null){
                                        $scope.filter.stopWatching();
                                        $window.location.reload();
                                    } else {
                                        console.log("Tx not included in this block. Waiting for reciept.");
                                    }
                                } else {
                                    console.error(err);
                                } 
                            });
                        });
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