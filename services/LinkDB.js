Community.service('LinkDB', ['$q','IpfsService', function ($q,IpfsService) {
    console.log('Loading LinkDB');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var LinkAddress = '0x20341C24385f625e410bA5966E4f7708045a86dC'; //TestNet
    var LinkContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"},{"indexed":false,"name":"shardAddress","type":"address"}],"name":"CreateShard_event","type":"event"}]);
    var LinkInstance = LinkContract.at(LinkAddress);
  
    var ShardAbi = [{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfsHash","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    var LinkDB = JSON.parse(localStorage.getItem('LinkDB'));
    if(!LinkDB){
        LinkDB = {
            Shard_addresses:{
                //shardName: shardAddress
            }
        };
        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    }
    
    var saveLinkDB = function(){
        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    };
    
    var getFromBlock = function(Shard){
        var deferred = $q.defer();
        
        var async_getShardInfo = Shard.getShardInfo(
        function(err, info){
            if(!err){
                var blockCreated = info[1].c[0];
                //console.log(blockCreated);
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
            LinkInstance.createShard(shardName, {from:web3.eth.accounts[0],gas: 4700000}, 
            function(error, txHash){
                if(!error){
                    var aysnc_filter = web3.eth.filter('latest', function(err, blockHash) {
                        var async_reciept = web3.eth.getTransactionReceipt(txHash, 
                        function(err,receipt){
                            if(!err){
                                if(receipt !== null){
                                    async_filter.stopWatching();
                                    var shardAddress = receipt.conractAddress;
                                    console.log(receipt,shardAddress);
                                    deferred.resolve(shardAddress);
                                } else {
                                    console.log("Tx not included in this block. Waiting for reciept.");
                                }
                            } else {
                                deferred.reject(err);
                            } 
                        });
                    });
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;
        },
        getTotalShards: function(){

        },
        getShardName: function(shardIndex){
        
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
                            LinkDB.Shard_addresses[shardName] = shardAddress;
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
            var promise_ipfsHash = IpfsService.getIpfsHash(post)
            .then(function (ipfsHash) {
                console.log(ipfsHash, web3.eth.accounts[0]);
                var asyncShardAddress = LinkDB.getShardAddress(post.postCommunity).then(
                function(shardAddress){
                    if(shardAddress){
                        var Shard = LinkDB.getShardInstance(shardAddress);
                        var submitPost = Shard.broadcast(ipfsHash, {from: web3.eth.accounts[0], gas: 4700000}, 
                        function(err, txHash){
                            if(!err)
                                deferred.resolve(txHash);
                            else
                                deferred.reject(err);
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
        },
        //////////////////////
        // Helper functions //
        //////////////////////
        getEvents: function(shardName){
            var deferred = $q.defer();
            var async_getShardAddress = service.getShardAddress(shardName).then(
            function(shardAddress){
                if(shardAddress){
                    var Shard = ShardContract.at(shardAddress);
                    var async_fromBlock = getFromBlock(Shard).then(
                    function(fromBlock){
                        if(fromBlock){
                            console.log('Fetching events from block ' + fromBlock + ' to current block');
                            deferred.resolve(Shard.allEvents({fromBlock: fromBlock}));
                        } else {
                            deferred.reject('Shard not created yet');
                        }
                    }, function(err){
                        deferred.reject(err);
                    });
                } else {
                    deferred.reject("Shard not created yet");
                }
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getShardInstance: function(shardAddress){
            var Shard = ShardContract.at(shardAddress);
            return Shard;
        },
        createShard: function(shardName){
            var deferred = $q.defer();
            LinkInstance.createShard(shardName, {from:web3.eth.accounts[0],gas: 4700000}, 
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