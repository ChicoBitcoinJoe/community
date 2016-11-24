Community.service('ShardService', ['$q','Web3Service', function ($q,Web3Service) {
    console.log('Loading Shard Service');
  
    var ShardAbi = [{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    var service = {
        /////////////////////////
        // Shard.sol Functions //
        /////////////////////////
        broadcast: function(shardAddress, ipfsHash, args){ 
            //Shard.broadcast(ipfsHash, {from: Web3Service.getCurrentAccount(), gas: 4700000}
            var deferred = $q.defer();
            var Shard = ShardContract.at(shardAddress);
            var submitPost = Shard.broadcast(ipfsHash, args, 
            function(err, txHash){
                if(!err){
                    Web3Service.getTransactionReceipt(txHash).then(
                    function(receipt){
                        deferred.resolve(receipt);
                    }, function(err){
                        deferred.reject(err);
                    });
                } else{
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getShardInfo: function(Shard){
            var deferred = $q.defer();

            var async_getShardInfo = Shard.getShardInfo(
            function(err, info){
                if(!err){
                    console.log(info);
                    deferred.resolve(info);
                } else {
                    deferred.reject(err);
                }
            });

            return deferred.promise;
        },
        //////////////////////
        // Helper Functions //
        //////////////////////
        getShardEvents: function(shardAddress,args){ 
            var deferred = $q.defer();
            
            if(shardAddress){
                var Shard = ShardContract.at(shardAddress);
                console.log("Fetching all events for", shardAddress);
                Shard.allEvents(args).get(
                function(err, events){
                    if(!err){
                        deferred.resolve(events);
                    } else {
                        deferred.reject(err);
                    }
                });
            } else {
                deferred.resolve(false);
            }
                        
            return deferred.promise;
        }
    }
    
    return service;
}]); 