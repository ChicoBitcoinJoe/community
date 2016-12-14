Community.service('ShareService', ['$q','Web3Service','ShardService', function ($q,Web3Service,ShardService) {
    console.log('Loading Share Service');
    
    var ShareAddress = '0xbd2971fa28d7fe466f73c16894ef99b88ce4bb86';//TestNet
    var ShareContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"}],"name":"CreateShard_event","type":"event"}]);
    var ShareInstance = ShareContract.at(ShareAddress);
    
    var service = {
        createShard: function(shardName){
            var deferred = $q.defer();
            ShareInstance.createShard(shardName, {from:Web3Service.getCurrentAccount(),gas: 4700000}, 
            function(error, txHash){
                if(!error){
                    Web3Service.getTransactionReceipt(txHash)
                    .then(function(receipt){
                        deferred.resolve(receipt);
                    }, function(err){
                        deferred.reject(err);
                    });
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;
        },
        getTotalShards: function(){
            var deferred = $q.defer();
            ShareInstance.getTotalShards(
            function(err,totalShards){
                if(!err){
                    console.log(totalShards);
                    deferred.resolve(totalShards);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getShardAddress: function(shardName){
            var deferred = $q.defer();

            var localAddress = localStorage.getItem(shardName+'_shard_address');
            if(!localAddress){
                ShareInstance.getShardAddress(shardName, function(error,shardAddress){
                    if(!error){
                        if(shardAddress === '0x0000000000000000000000000000000000000000' || shardAddress === '0x'){
                            deferred.resolve(false);
                        } else {
                            //console.log("saved shard " + shardName + " at address: " + shardAddress);
                            localStorage.setItem(shardName+'_shard_address',shardAddress)
                            deferred.resolve(shardAddress);    
                        }
                    } else {
                        deferred.reject(error);
                    }
                });
            } else {
                deferred.resolve(localAddress);
            }

            return deferred.promise;
        },
        getShardName: function(shardAddress){
            //To Do When Needed
        },
        getEvents: function(shardName, fromBlock){
            var deferred = $q.defer();
            var async_getAddress = service.getShardAddress(shardName).then(
            function(shardAddress){
                console.log("Fetching last 30 days of events for " + shardName);
                ShardService.getShardEvents(shardAddress, {fromBlock:fromBlock}).then(
                function(events){
                    console.log("Fetched last 30 days of events for " + shardName);
                    deferred.resolve(events);
                }, function(err){
                    deferred.reject(err);
                });
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        }
    }
    
    return service;
}]); 