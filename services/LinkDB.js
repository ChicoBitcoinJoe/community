Community.service('LinkDB', ['$q','IpfsService','Web3Service', function ($q,IpfsService,Web3Service) {
    console.log('Loading LinkDB');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var LinkAddress = '0x45848De584283e5EC459B5454b12281e10694200'; //TestNet
    var LinkContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"}],"name":"CreateShard_event","type":"event"}]);
    var LinkInstance = LinkContract.at(LinkAddress);
  
    var ShardAbi = [{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    var LinkDB = JSON.parse(localStorage.getItem('LinkDB'));
    if(!LinkDB){
        LinkDB = {
            Shard_addresses:{
                /*shardName: {
                    shardAddress:'0xabc',
                    block_created:0,
                    last_block_seen:0
                }*/
            }
        };
        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    }
    
    var saveLinkDB = function(){
        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    };
    
    var getShardInfo = function(Shard){
        var deferred = $q.defer();
        
        var async_getShardInfo = Shard.getShardInfo(
        function(err, info){
            if(!err){
                console.log(info);
                var blockCreated = info[1].c[0];
                deferred.resolve(blockCreated);
            } else {
                deferred.resolve(false);
            }
        });
            
        return deferred.promise;
    };
    
    var service = {
        //////////////////////////
        // LinkDB.sol functions //
        //////////////////////////
        createShard: function(shardName){
            var deferred = $q.defer();
            LinkInstance.createShard(shardName, {from:Web3Service.getCurrentAccount(),gas: 4700000}, 
            function(error, txHash){
                if(!error){
                    Web3Service.getTransactionReceipt(txHash)
                    .then(function(receipt){
                        deferred.resolve(true);
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

        },
        getShardAddress: function(shardName){
            var deferred = $q.defer();

            var localAddress = LinkDB.Shard_addresses[shardName];
            if(!localAddress){
                LinkInstance.getShardAddress(shardName, function(error,shardAddress){
                    if(!error){
                        if(shardAddress === '0x0000000000000000000000000000000000000000' || shardAddress === '0x'){
                            deferred.resolve(false);
                        } else {
                            console.log("saved shard " + shardName + " at address: " + shardAddress);
                            LinkDB.Shard_addresses[shardName] = {};
                            LinkDB.Shard_addresses[shardName].shardAddress = shardAddress;
                            LinkDB.Shard_addresses[shardName].last_block_seen = 0; //eventually shardInfo.block_created 
                            saveLinkDB();
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
        /////////////////////////
        // Shard.sol Functions //
        /////////////////////////
        broadcast: function(data){
            //Add to ipfs
            var deferred = $q.defer();
            console.log(data);
            var promise_ipfsHash = IpfsService.getIpfsHash(data).then(
            function (ipfsHash) {
                console.log(ipfsHash, Web3Service.getCurrentAccount(),data);
                var asyncShardAddress = service.getShardAddress(data.community).then(
                function(shardAddress){
                    if(shardAddress){
                        var Shard = service.getShardInstance(shardAddress);
                        var submitPost = Shard.broadcast(ipfsHash, {from: Web3Service.getCurrentAccount(), gas: 4700000}, 
                        function(err, txHash){
                            if(!err){
                                Web3Service.getTransactionReceipt(txHash).then(
                                function(receipt){
                                    deferred.resolve(ipfsHash);
                                }, function(err){
                                    deferred.reject(err);
                                });
                            } else{
                                deferred.reject(error);
                            }
                        });
                    } else {
                        deferred.resolve(false);
                    }
                }, function(err){
                    deferred.reject(err);
                });
            }, function(err) {
                deferred.reject(err);
            });
            
            return deferred.promise;
        },
        //////////////////////
        // Helper functions //
        //////////////////////
        getShardInstance: function(shardAddress){
            var Shard = ShardContract.at(shardAddress);
            return Shard;
        },
        getShardEvents: function(shardName){ 
            var deferred = $q.defer();
            var async_getShardAddress = service.getShardAddress(shardName).then(
            function(shardAddress){
                if(shardAddress){
                    var Shard = ShardContract.at(shardAddress);
                    var async_toBlock = web3.eth.getBlockNumber(
                    function(err, toBlock){
                        if(!err){
                            var fromBlock = 0; //LinkDB.Shard_addresses[shardName].last_block_seen;
                            console.log('Fetching events from block ' + fromBlock + ' to ' + toBlock);
                            var args = {fromBlock:fromBlock,toBlock:toBlock};
                            Shard.allEvents(args).get(
                            function(err, events){
                                if(!err){
                                    saveLinkDB();
                                    deferred.resolve(events);
                                } else {
                                    deferred.reject(err);
                                }
                            });
                        } else {
                            deferred.reject(err);
                        }
                    });
                } else {
                    deferred.resolve(false)
                }
            }, function(err){
                deferred.resolve(false);
            });
            
            return deferred.promise;
        },
        createShard: function(shardName){
            var deferred = $q.defer();
            LinkInstance.createShard(shardName, {from:Web3Service.getCurrentAccount(),gas: 4700000}, 
            function(error, txHash){
                if(!error){
                    deferred.resolve(txHash);
                } else{
                    deferred.reject(error);
                }
            });

            return deferred.promise;
        }
    }
    
    return service;
}]); 