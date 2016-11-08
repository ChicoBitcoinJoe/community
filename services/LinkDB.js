Community.service('LinkDB', ['$q', function ($q) {
    console.log('Loading LinkDB');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var LinkAddress = '0xeE92ba7CA48b5a18283c5F5c927EF891Fe7f1C98'; //TestNet
    var LinkContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"},{"indexed":false,"name":"shardAddress","type":"address"}],"name":"NewShard_event","type":"event"}]);
    var LinkInstance = LinkContract.at(LinkAddress);
  
    var ShardAbi = [{"constant":false,"inputs":[{"name":"metadata","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getShardInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"shard_name","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"metadata","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    
    var LinkDB = JSON.parse(localStorage.getItem('LinkDB'));
    if(!LinkDB){
        LinkDB = {
            Broadcast_events:{
            /*  shard:{
                    lastBlock:1700000,
                    events:{
                        txHash: {
                            txHash: event.transactionHash,
                            community: community,
                            poster: poster,
                            block: event.blockNumber,
                            metadata: event.args.metadata
                        }
                    }
                }//*/
            },
            Shard_addresses:{
                //shardName: shardAddress
            }
        };

        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    }
    
    
    var saveLinkDB = function(){
        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    };
    
    var saveShardAddress = function(shardName,shardAddress){
        LinkDB.Shard_addresses[shardName] = shardAddress;
        saveLinkDB();
    }
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var service = {
        getPosts: function(shardName){
            var old_posts = [
                {
                    postType:"self",
                    postCommunity:"community",
                    postTitle:"Very eu much fugiat so dolore, very enim much reprehenderit such ut very padding. Such consequat much minim very pariatur so enim very ad very dolore."
                    
                },{ 
                    postType:"image",
                    postCommunity:"community",
                    postTitle:"Very eu much fugiat so dolore, very enim much reprehenderit such ut very padding. Such consequat much minim very pariatur so enim very ad very dolore.",
                    postLink:"images/red_flowers.jpg"
                    
                },{
                    postType:"link",
                    postCommunity:"community",
                    postTitle:"Very eu much fugiat so dolore, very enim much reprehenderit such ut very padding. Such consequat much minim very pariatur so enim very ad very dolore.",
                    postLink:"https://github.com/ChicoBitcoinJoe/Community"
                    
                },{
                    postType:"video",
                    postCommunity:"community",
                    postTitle:"Very eu much fugiat so dolore, very enim much reprehenderit such ut very padding. Such consequat much minim very pariatur so enim very ad very dolore.",
                    postLink:"m.youtube.com/watch?v=xSGW7CwD5GM"

                },{ 
                    postType:"image",
                    postCommunity:"community",
                    postTitle:"Very eu much fugiat so dolore, very enim much reprehenderit such ut very padding. Such consequat much minim very pariatur so enim very ad very dolore.",
                    postLink:"images/bumble_bee.jpg"
                }
            ];
            
            return old_posts;
        },
        getShardEvents: function(shardName){
            if(!LinkDB.Broadcast_events[shardName])
                LinkDB.Broadcast_events[shardName] = {events:{}};

            return LinkDB.Broadcast_events[shardName];
        },
        getShardAddress: function(shardName){
            var deferred = $q.defer();

            var shardAddress = LinkDB.Shard_addresses[shardName];
            if(!shardAddress){
                LinkInstance.getShardAddress(shardName, function(error,shardAddress){
                    if(!error){
                        if(shardAddress === '0x0000000000000000000000000000000000000000' || shardAddress === '0x'){
                            deferred.resolve(null);
                        } else {
                            saveShardAddress(shardAddress);
                            deferred.resolve(shardAddress);    
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
            return LinkDB.Broadcast_events[shardName].lastBlock;
        },
        storeEvent: function(shardName, event){
            if(event.event === 'Broadcast_event'){
                //console.log('Post_event',event);
                //console.log("shardName,event: " + shardName, event);
                storePost(event,shardName);
            } else if(event.event === 'Vote_event'){
                //console.log('Post_event',event);
                storeVote(event);
            }
                
            //save changes to local storage
            saveLinkDB();
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