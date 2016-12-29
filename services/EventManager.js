Community.service('EventManager', ['$q','Web3Service',
function ($q,Web3Service) {
    console.log('Loading Event Manager Service');
    
    var EventManager = {
        defaultLookBack: 4*60*24*60, //30 days of blocks at 4 blocks per minute
        defaultPruneDepth: 4*60*24*90, //90 days of blocks at 4 blocks per minute
        events:{},
        store: function(channelName, event){
            //console.log(event);
            
            EventManager.touchBlock(channelName, event.blockNumber);
            
            if(EventManager.events[channelName].blocks[event.blockNumber].indexOf(event.transactionHash) == -1){
                EventManager.events[channelName].blocks[event.blockNumber].push(event.transactionHash);
            }
            
            localStorage.setItem(event.transactionHash,JSON.stringify(event));
            
            if(event.blockNumber > EventManager.events[channelName].lastBlock)
                EventManager.events[channelName].lastBlock = event.blockNumber;
        },
        removeEvent: function(event){
            console.log("removing",event);
            localStorage.removeItem(txHash);
        },
        prune: function(channelName, expired){
            EventManager.touchChannel(channelName);
            
            var blocks = EventManager.events[channelName].blocks;
            var blockKeys = Object.keys(blocks);
            for(key in blockKeys){
                var blockNumber = blockKeys[key];
                if(blockNumber <= expired){
                    console.log(txHash + ' is more than 3 months old... pruning!');
                    
                    //Need to delete localStorage txHash data
                    //For each tx in each block
                        //EventManager.removeEvent(txHash);
                    
                    delete EventManager.events[channelName].blocks[blockNumber];
                }
            }
        },
        touchChannel: function(channelName){
            //console.log("Touching " + channelName);
            if(!EventManager.events[channelName]){
                EventManager.events[channelName] = {};
                EventManager.events[channelName].blocks = {};
                EventManager.events[channelName].lastBlock = 0;
            }
        },
        touchBlock: function(channelName,blockNumber){
            EventManager.touchChannel(channelName);
            
            if(!EventManager.events[channelName].blocks[blockNumber]){
                EventManager.events[channelName].blocks[blockNumber] = [];
            }
        },
        storeEvents: function(channelName, events, currentBlock){
            for(index in events)
                EventManager.store(channelName, events[index]);
            
            EventManager.prune(channelName, currentBlock - EventManager.defaultPruneDepth);
            localStorage.setItem('EventManager.events',JSON.stringify(EventManager.events));
        },
        getEvents: function(channelName){
            EventManager.touchChannel(channelName);
            var oldEvents = [];
            
            var blocks = EventManager.events[channelName].blocks;
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
        getChannelEvents: function(channelName,Channel){
            var deferred = $q.defer();
            
            EventManager.touchChannel(channelName);
            var fromBlock = EventManager.events[channelName].lastBlock;
            Web3Service.getCurrentBlock().then(
            function(currentBlock){
                var defaultSpan = currentBlock - EventManager.defaultLookBack;
                //console.log(fromBlock,currentBlock,defaultSpan);
                if(defaultSpan < 0)
                    defaultSpan = 0;
                
                if(fromBlock < defaultSpan)
                    fromBlock = defaultSpan;
                
                var args = {fromBlock:fromBlock};
                if(fromBlock < currentBlock){
                    console.log("Fetching events for " + channelName + " from " + fromBlock + " to " + currentBlock);
                    var async_getEvents = Channel.allEvents(args).get(
                    function(err, events){
                        if(!err){
                            var oldEvents = EventManager.getEvents(channelName);
                            
                            EventManager.events[channelName].lastBlock = currentBlock;
                            EventManager.storeEvents(channelName,events,currentBlock);
                            
                            //Add in old events to new events
                            for(index in oldEvents){
                                var local = localStorage.getItem(oldEvents[index]);
                                events[oldEvents[index]] = JSON.parse(local);
                            }
                            //console.log(events);
                            
                            deferred.resolve(events);
                        } else {
                            deferred.reject(err);
                        }
                    });
                } else {
                    var oldEvents = EventManager.getEvents(channelName);
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
