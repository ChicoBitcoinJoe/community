Community.service('EventManager', ['$q',
function ($q) {
    console.log('Loading Event Manager Service');
    
    var EventManager = {
        defaultLookBack: 4*60*24*30, //30 days of blocks at 4 blocks per minute
        events:{
        /*  shardName:{
                blocks: {
                    0:[]
                },
                lastBlock:0
            }*/
        },
        store: function(event){
            console.log(event);
            var shardName = event.args.shardName;
            EventManager.touchBlock(shardName, event.blockNumber);
            
            EventManager.events[shardName].blocks[event.blockNumber].push(event.transactionHash);
            localStorage.setItem(event.transactionHash,JSON.stringify(event));
            
            if(event.blockNumber > EventManager.events[shardName].lastBlock)
                EventManager.events[shardName].lastBlock = event.blockNumber;
        },
        removeEvent: function(event){
            console.log("removing",event);
            
        },
        prune: function(shardName, expired){
            EventManager.touchShard(shardName);
            
            var blocks = Object.keys(EventManager.events[shardName].blocks);
            for(block in blocks){
                if(block <= expired){
                    for(index in block)
                        var txHash = block[index];
                        localStorage.removeItem(txHash); //removeEvent(block[tx]);
                    
                    delete EventManager.events[shardName].blocks[block];
                }
            }
        },
        touchShard: function(shardName){
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
        storeEvents: function(shardName, events){
            for(index in events)
                EventManager.store(events[index]);
            
            EventManager.prune(shardName, EventManager.defaultLookBack);
            localStorage.setItem('EventManager.events',JSON.stringify(EventManager.events));
        },
    };
    
    var localEvents = localStorage.getItem('EventManager.events');
    if(localEvents)
        EventManager.events = JSON.parse(localEvents);
    
    var service = {
        getShardEvents: function(shardName,Shard,args){
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
        }
    };
    
    return service;
}]);
