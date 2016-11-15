Community.service('EventHandler', ['$q','LinkDB', function ($q,LinkDB) {
    console.log('Loading EventHandler');
    
    var ShardAbi = [{"constant":false,"inputs":[{"name":"metadata","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"metadata","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);

    var watchers = {
        //name:[],
        //name2:[]
    }
    
    var service = {
        watch: function(shardName){
            if(!watchers[shardName]){
                console.log("Attempting to watch " + shardName);
                
                var deferred = $q.defer();
                LinkDB.getShardAddress(shardName).then(
                function(shardAddress){
                    if(shardAddress){
                        deferred.resolve(shardAddress);
                    } else {
                        deferred.reject(shardName + " has not been created yet.");
                    }
                }, function(err){
                    deferred.reject(err);
                });
                
                deferred.promise.then(
                function(shardAddress){
                    //console.log("Found " + shardName + " address: " + shardAddress);
                    var Shard = ShardContract.at(shardAddress);
                    Shard.getShardInfo(function(err, info){
                        //console.log(info);
                        if(!err){
                            var asyncFromBlock = LinkDB.getFromBlock(shardName).then(
                            function(fromBlock){
                                console.log('Fetching events from block ' + fromBlock + ' to current block');
                                watchers[shardName] = Shard.allEvents({fromBlock: fromBlock}, 
                                function(err,event){
                                    if(!err){
                                        //console.log(shardName, event);
                                        console.log("Updating " + shardName + " block number to " + event.blockNumber);
                                        LinkDB.updateLastBlock(shardName, event.blockNumber);
                                        LinkDB.storeEvent(shardName,event);
                                        
                                    } else {
                                        deferred.reject(err);
                                    }
                                });
                            }, function(err){
                                deferred.reject(err);
                            });
                        } else {
                            deferred.reject(err);
                        }
                    });
                }, function(err){
                    console.log(err)
                })
            } else {
                console.log("Already watching " + shardName);    
            }
        },
        unwatchAll: function(){
            console.log(watchers);
            for(index in watchers){
                console.log("Stopped watching " + watchers[index]);
                watchers[index].stopWatching();
            }
            
            watchers = [];
        }
    }
    
    return service;
}]); 