Community.service('EventManager', ['$q','Web3Service',
function ($q,Web3Service) {
    console.log('Loading Event Manager Service');
    
    var EventManager = {
        defaultLookBack: 4*60*24*30, //30 days of blocks at 4 blocks per minute
        defaultPruneDepth: 4*60*24*90, //90 days of blocks at 4 blocks per minute
        events:{},
        store: function(event){
            console.log(event);
            var shardName = event.args.shardName;
            EventManager.touchBlock(shardName, event.blockNumber);
            
            if(EventManager.events[shardName].blocks[event.blockNumber].indexOf(event.transactionHash) == -1){
                EventManager.events[shardName].blocks[event.blockNumber].push(event.transactionHash);
                localStorage.setItem(event.transactionHash,JSON.stringify(event));
            }
            
            if(event.blockNumber > EventManager.events[shardName].lastBlock)
                EventManager.events[shardName].lastBlock = event.blockNumber;
        },
        removeEvent: function(event){
            console.log("removing",event);
            localStorage.removeItem(txHash);
        },
        prune: function(shardName, expired){
            EventManager.touchShard(shardName);
            
            var blocks = EventManager.events[shardName].blocks;
            var blockKeys = Object.keys(blocks);
            for(key in blockKeys){
                var blockNumber = blockKeys[key];
                if(blockNumber <= expired){
                    console.log(txHash + ' is more than 3 months old... pruning!');
                    
                    //Need to delete localStorage txHash data
                    //For each tx in each block
                        //EventManager.removeEvent(txHash);
                    
                    delete EventManager.events[shardName].blocks[blockNumber];
                }
            }
        },
        touchShard: function(shardName){
            //console.log("Touching " + shardName);
            if(!EventManager.events[shardName]){
                EventManager.events[shardName] = {};
                EventManager.events[shardName].blocks = {};
                EventManager.events[shardName].lastBlock = 0;
            }
        },
        touchBlock: function(shardName,blockNumber){
            EventManager.touchShard(shardName);
            
            if(!EventManager.events[shardName].blocks[blockNumber]){
                EventManager.events[shardName].blocks[blockNumber] = [];
            }
        },
        storeEvents: function(shardName, events, currentBlock){
            for(index in events)
                EventManager.store(events[index]);
            
            EventManager.prune(shardName, currentBlock - EventManager.defaultPruneDepth);
            localStorage.setItem('EventManager.events',JSON.stringify(EventManager.events));
        },
        getEvents: function(shardName){
            EventManager.touchShard(shardName);
            var oldEvents = [];
            
            var blocks = EventManager.events[shardName].blocks;
            var blockNumber = Object.keys(blocks);
            for(index in blockNumber){
                var blockTransactions = blocks[blockNumber[index]];
                for(tx in blockTransactions){
                    oldEvents.push(blockTransactions[tx]);
                }
            }
            
            return oldEvents
        }
    };
    
    var localEvents = localStorage.getItem('EventManager.events');
    if(localEvents)
        EventManager.events = JSON.parse(localEvents);
    
    var service = {
        getShardEventsCustom: function(shardName,Shard,args){
            var deferred = $q.defer();
            
            console.log("Fetching events for", shardName);
            var async_getEvents = Shard.allEvents(args).get(
            function(err, events){
                if(!err){
                    EventManager.storeEvents(shardName,events);
                    deferred.resolve(events);
                } else {
                    deferred.reject(err);
                }
            });
           
            return deferred.promise;
        },
        getShardEvents: function(shardName,Shard){
            var deferred = $q.defer();
            
            EventManager.touchShard(shardName);
            var fromBlock = EventManager.events[shardName].lastBlock;
            Web3Service.getCurrentBlock().then(
            function(currentBlock){
                
                var defaultSpan = currentBlock - EventManager.defaultLookBack;
                //console.log(fromBlock,currentBlock,defaultSpan);
                if(fromBlock < defaultSpan )
                    fromBlock = defaultSpan;
                
                var args = {fromBlock:fromBlock};
                if(fromBlock < currentBlock){
                    console.log("Fetching events for " + shardName + " from " + fromBlock + " to " + currentBlock);
                    var async_getEvents = Shard.allEvents(args).get(
                    function(err, events){
                        if(!err){
                            EventManager.events[shardName].lastBlock = currentBlock;
                            EventManager.storeEvents(shardName,events,currentBlock);

                            var oldEvents = EventManager.getEvents(shardName);

                            //Add in old events to new events
                            for(index in oldEvents){
                                var local = localStorage.getItem(oldEvents[index]);
                                events[oldEvents[index]] = JSON.parse(local);
                            }
                            deferred.resolve(events);
                        } else {
                            deferred.reject(err);
                        }
                    });
                } else {
                    var oldEvents = EventManager.getEvents(shardName);
                    var events = {};
                    
                    for(index in oldEvents){
                        var local = localStorage.getItem(oldEvents[index]);
                        events[oldEvents[index]] = JSON.parse(local);
                    }
                    
                    deferred.resolve(events);
                }
            });
           
            return deferred.promise;
        }
    };
    
    return service;
}]);
