Community.service('Community', ['$q','LinkDB','IpfsService', function ($q, LinkDB, IpfsService) {
    console.log('Loading Community');
    
    var service = {
        submitPost: function(post){
            var deferred = $q.defer();
   
            if(post.postType && post.postTitle && post.postCommunity && post.poster &&(post.postLink || post.postComment)){
                //Add to ipfs
                var promise_ipfsHash = IpfsService.getIpfsHash(post)
                .then(function (ipfsHash) {
                    console.log(ipfsHash, web3.eth.accounts[0]);
                    var asyncShardAddress = LinkDB.getShardAddress(post.postCommunity).then(
                    function(shardAddress){
                        var Shard = LinkDB.getShardInstance(shardAddress);
                        var submitPost = Shard.broadcast(ipfsHash, {from: web3.eth.accounts[0], gas: 4700000}, 
                        function(err, txHash){
                            if(!err)
                                deferred.resolve(txHash);
                            else
                                deferred.reject(err);
                        });   
                    }, function(err){
                        deferred.reject(err);
                    });
                    
                }, function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(false);
            }
            
            return deferred.promise;
        },
        getPosts: function(community){
            var deferred = $q.defer();
            
            var localShardAddress = LinkDB.getShardAddress(community).then(
            function(shardAddress){
                if(shardAddress){
                    var Shard = LinkDB.getShardInstance(shardAddress);
                    var asyncFromBlock = LinkDB.getFromBlock(community).then(
                    function(fromBlock){
                        console.log(fromBlock);
                        var events = Shard.allEvents({fromBlock: fromBlock}, function(err,event){
                            if(!err){
                                console.log(event);
                                //LinkDB.storeEvent(community,event); 
                            } else {
                                deferred.reject(err);
                            }
                        });
                    
                        deferred.resolve(LinkDB.getShardEvents(community));
                        
                    }, function(err){
                        deferred.reject(err);
                    });
                    
                } else {
                    deferred.resolve(false);
                } 
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        }
    }
    
    return service;
}]); 