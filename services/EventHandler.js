Community.service('EventHandler', ['$q','LinkDB', function ($q,LinkDB) {
    console.log('Loading EventHandler');
    
    var ShardAbi = [{"constant":false,"inputs":[{"name":"metadata","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"metadata","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);

    var watchers = [];
    
    var service = {
        watch: function(shardName){
            if(!watchers[shardName]){
                //console.log("Attempting to watch " + shardName);
                
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
                            watchers[shardName] = Shard.allEvents({fromBlock: info[1].c[0]}, 
                            function(err,event){
                                if(!err){
                                    //console.log(shardName, event);
                                    LinkDB.storeEvent(shardName,event);
                                    LinkDB.updateLastSeenBlock(shardName, info[1].c[0]);
                                } else {
                                    deferred.reject(err);
                                }
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