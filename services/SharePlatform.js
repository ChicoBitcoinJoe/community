Community.service('SharePlatform', ['$q','Web3Service','EventManager',
function ($q,Web3Service,EventManager) {
    console.log('Loading Share Service');
    
    var ShareAddress = '0xbd2971fa28d7fe466f73c16894ef99b88ce4bb86';//TestNet
    var ShareContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"}],"name":"CreateShard_event","type":"event"}]);
    var ShareInstance = ShareContract.at(ShareAddress);
    
    var ShardAbi = [{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"}],"name":"share","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"},{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"}],"name":"Share_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    var service = {
        /////////////////////////
        // Share.sol Functions //
        /////////////////////////
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
        getShardEvents: function(shardName){
            var deferred = $q.defer();
            var async_getAddress = service.getShardAddress(shardName).then(
            function(shardAddress){
                if(shardAddress){
                    var Shard = ShardContract.at(shardAddress);
                    EventManager.getShardEvents(shardName,Shard).then(
                    function(events){
                        deferred.resolve([shardName,events]);
                    }, function(err){
                        deferred.reject(err);
                    });
                } else {
                    deferred.reject(shardName + ' shard does not exist!');
                }
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        },
        /////////////////////////
        // Shard.sol Functions //
        /////////////////////////
        share: function(shardAddress, ipfsHash, args){ 
            //Shard.share(ipfsHash, {from: Web3Service.getCurrentAccount(), gas: 4700000}
            var deferred = $q.defer();
            var Shard = ShardContract.at(shardAddress);
            var submitPost = Shard.share(ipfsHash, args, 
            function(err, txHash){
                if(!err){
                    var Shard = ShardContract.at(shardAddress);
                    console.log("Watching events for", shardAddress);
                    var watcher = Shard.allEvents().watch(
                    function(err, event){
                        console.log(event);
                        if(!err){
                            if(event.transactionHash == txHash){
                                localStorage.setItem(txHash,JSON.stringify(event));
                                watcher.stopWatching();
                                deferred.resolve(txHash);
                            }
                        } else {
                            deferred.reject(err);
                        }
                    }); 
                } else{
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getShardInfo: function(shardAddress){
            var deferred = $q.defer();
            
            var Shard = ShardContract.at(shardAddress);
            var async_getShardInfo = Shard.getShardInfo(
            function(err, info){
                if(!err){
                    //console.log(info);
                    deferred.resolve(info);
                } else {
                    deferred.reject(err);
                }
            });

            return deferred.promise;
        }
    }
    
    return service;
}]); 