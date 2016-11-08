Community.controller('CommunityViewController', ['$scope','LinkDB',
function($scope, LinkDB) {
    
    $scope.loaded = false;
    $scope.created = false;
    $scope.buttonState = "Create this Community: " + $scope.activeView;
    
    $scope.posts = LinkDB.getPosts($scope.activeView);
    
    $scope.postss = LinkDB.getShardEvents($scope.activeView).events;
    console.log($scope.posts);
    var localShardAddress = LinkDB.getShardAddress($scope.activeView).then(
    function(shardAddress){
        if(shardAddress){
            $scope.created = true;
            console.log("Fetching events from " + $scope.activeView + " shard address: " + shardAddress);
            
            var Shard = LinkDB.getShardInstance(shardAddress);
            var fromBlock = LinkDB.getFromBlock($scope.activeView);
            var events = Shard.allEvents({fromBlock: fromBlock}, function(error,event){
                if(!error){
                    $scope.loaded = true;
                    LinkDB.storeEvent($scope.activeView,event); 
                } else {
                    console.error(error);
                }
            });
        } else {
            console.log($scope.activeView + " does not exist!");
            $scope.loaded = true;
        } 
    }, function(error){
        console.error(error);
    });
    
    $scope.clicked = false;
    $scope.createCommunity = function(community){
        if(!$scope.clicked){
            $scope.buttonState = "Please wait while " + $scope.activeView + " is being created!";
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
                                $scope.created = true;
                                $scope.loaded = true;
                                $scope.filter.stopWatching();
                            } else {
                                console.log("Tx not included in this block. Waiting for reciept.");
                            }
                        } else {
                            console.error(err);
                        } 
                    });
                });
            },function(error){
                $scope.buttonState = "Error creating " + $scope.activeView + ". Click to try again...";
                $scope.clicked = false;
                console.error(error);
            });
        }
    };
}]);