Community.service('LinkDB', ['$q','IpfsService', function ($q,IpfsService) {
    console.log('Loading LinkDB');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var LinkAddress = '0x18055297c85d884216540d36e799199e8c600eaa'; //TestNet
    var LinkContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"},{"indexed":false,"name":"shardAddress","type":"address"}],"name":"NewShard_event","type":"event"}]);
    var LinkInstance = LinkContract.at(LinkAddress);
  
    var ShardAbi = [{"constant":false,"inputs":[{"name":"metadata","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"metadata","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    
    var LinkDB = JSON.parse(localStorage.getItem('LinkDB'));
    if(!LinkDB){
        LinkDB = {
            Broadcast_events:{
            /*  shard:{
                    lastBlock:1700000,
                    posts:[Qm123],
                    comments:{
                        Qm123:[Qmabc],
                        Qmabc:[]
                    }
                }//*/
            },
            Shard_addresses:{
                //shardName: shardAddress
            }
        };

        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    }
    
    var storeEvent = function(shardName,event){
        var ipfsHash = event.args.metadata;
        

        IpfsService.getIpfsData(ipfsHash).then(
        function(post){            
            if(post.postType && !post.postParent && post.postTitle && post.postCommunity && post.poster &&(post.postLink || post.postComment)){
                console.log("Post event");
                if(LinkDB.Broadcast_events[shardName].posts.indexOf(ipfsHash) == '-1'){
                    console.log("Storing post " + ipfsHash);
                    LinkDB.Broadcast_events[shardName].posts.push(ipfsHash);
                    if(!LinkDB.Broadcast_events[shardName].comments[ipfsHash])
                        LinkDB.Broadcast_events[shardName].comments[ipfsHash] = [];
                } else {
                    console.log(ipfsHash + " is already stored.");
                }
                
            } else if(post.postCommunity && post.poster && post.postComment && post.postParent && !post.postTitle){
                console.log("Comment event");
                if(!LinkDB.Broadcast_events[shardName].comments[ipfsHash])
                    LinkDB.Broadcast_events[shardName].comments[ipfsHash] = [];
                var comments = LinkDB.Broadcast_events[shardName].comments;
                if(comments){
                    if(Object.keys(comments).indexOf(ipfsHash) == '-1'){
                        LinkDB.Broadcast_events[shardName].comments[post.postParent].push(ipfsHash);
                    } else {
                        console.log(ipfsHash + " is already stored.");
                    }
                }
            } else {
                
                console.log("Invalid event."); //, event, post);
            }
        }, function(err){
            console.error(err);
        });
    }
    
    var saveLinkDB = function(){
        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    };
    
    var saveShardAddress = function(shardName,shardAddress){
        LinkDB.Shard_addresses[shardName] = shardAddress;
        saveLinkDB();
        console.log("saved shard " + shardName + " at address: " + shardAddress);
    }
    
    var exists = function(shardName){
        if(!LinkDB.Broadcast_events[shardName]){
            LinkDB.Broadcast_events[shardName] = {
                lastBlock:null,
                posts:[],
                comments:{}
            };
        }
    }
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var service = {
        getShardEvents: function(shardName){
            exists(shardName);

            return LinkDB.Broadcast_events[shardName].posts;
        },
        getShardAddress: function(shardName){
            exists(shardName);
            var deferred = $q.defer();

            var shardAddress = LinkDB.Shard_addresses[shardName];
            if(!shardAddress){
                LinkInstance.getShardAddress(shardName, function(error,shard_address){
                    if(!error){
                        if(shard_address === '0x0000000000000000000000000000000000000000' || shard_address === '0x'){
                            deferred.resolve(false);
                        } else {
                            saveShardAddress(shardName,shard_address);
                            deferred.resolve(shard_address);    
                        }
                    } else {
                        deferred.reject(error);
                    }
                });
            } else {
                deferred.resolve(shardAddress);
            }

            return deferred.promise;
        },
        getShardInstance: function(shardAddress){
            var Shard = ShardContract.at(shardAddress);
            return Shard;
        },
        getFromBlock: function(shardName){
            exists(shardName);
            
            var deferred = $q.defer();
            if(LinkDB.Broadcast_events[shardName].lastBlock)
                deferred.resolve(LinkDB.Broadcast_events[shardName].lastBlock);
            else {
                service.getShardAddress(shardName).then(
                function(shardAddress){
                    if(!shardAddress)
                        deferred.resolve(false);
                    else {
                        var ShardInstance = ShardContract.at(shardAddress);
                        ShardInstance.getShardInfo( function(error, info){
                            if(!error){
                                //console.log(info);
                                LinkDB.Broadcast_events[shardName].lastBlock = info[1].c[0];
                                saveLinkDB();
                                deferred.resolve(info[1].c[0]);
                            } else{
                                deferred.reject(error);
                            }
                        });
                    }
                },function(err){
                    deferred.reject(err);
                });
            }
            
            return deferred.promise;
        },
        storeEvent: function(shardName, event){
            exists(shardName);
            storeEvent(shardName,event);
            //save changes to local storage
            saveLinkDB();
        },
        updateLastBlock: function(shardName,lastBlock){
            exists(shardName);
            LinkDB.Broadcast_events[shardName].lastBlock = lastBlock;
            saveLinkDB();
        },
        createShard: function(shardName){
            exists(shardName);
            
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
        },
        getChildren: function(shardName,ipfsHash){
            exists(shardName);
            var children = LinkDB.Broadcast_events[shardName].comments;
            console.log(children);
            return children;
        }
    }
    
    return service;
}]); 