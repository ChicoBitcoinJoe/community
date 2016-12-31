Community.service('SharePlatform', ['$q','Web3Service','EventManager',
function ($q,Web3Service,EventManager) {
    console.log('Loading Share Service');
    
    var ShareAddress = '0x990EDbe88148C111f66E3f1e6117D8AC0a9c1B7f';//TestNet
    var ShareContract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getChannelName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalchannels","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"channelName","type":"string"}],"name":"createChannel","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"channelName","type":"string"}],"name":"getChannelAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"channelName","type":"string"}],"name":"NewChannel_event","type":"event"}]);
    var ShareInstance = ShareContract.at(ShareAddress);
    
    var ChannelAbi = [{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getChannelInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_channel_name","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"channel","type":"string"},{"indexed":false,"name":"hash","type":"string"}],"name":"Broadcast_event","type":"event"}];
    var ChannelContract = web3.eth.contract(ChannelAbi);
    
    var service = {
        /////////////////////////
        // Share.sol Functions //
        /////////////////////////
        createChannel: function(channelName){
            var deferred = $q.defer();
            ShareInstance.createChannel(channelName, {from:Web3Service.getCurrentAccount()}, 
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
        getTotalChannels: function(){
            var deferred = $q.defer();
            ShareInstance.getTotalChannels(
            function(err,totalChannels){
                if(!err){
                    console.log(totalChannels);
                    deferred.resolve(totalChannels);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getChannelAddress: function(channelName){
            var deferred = $q.defer();

            var localAddress = localStorage.getItem(channelName+'_channel_address');
            if(!localAddress){
                ShareInstance.getChannelAddress(channelName, function(error,channelAddress){
                    if(!error){
                        if(channelAddress === '0x0000000000000000000000000000000000000000' || channelAddress === '0x'){
                            deferred.resolve(false);
                        } else {
                            //console.log("saved channel " + channelName + " at address: " + channelAddress);
                            localStorage.setItem(channelName+'_channel_address',channelAddress)
                            deferred.resolve(channelAddress);    
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
        getChannelEvents: function(channelName){
            var deferred = $q.defer();
            var async_getAddress = service.getChannelAddress(channelName).then(
            function(channelAddress){
                if(channelAddress){
                    var Channel = ChannelContract.at(channelAddress);
                    EventManager.getChannelEvents(channelName,Channel).then(
                    function(events){
                        deferred.resolve([channelName,events]);
                    }, function(err){
                        deferred.reject(err);
                    });
                } else {
                    deferred.reject(channelName + ' channel does not exist!');
                }
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        },
        /////////////////////////
        // Channel.sol Functions //
        /////////////////////////
        broadcast: function(channelAddress, ipfsHash, args){ 
            //Channel.broadcast(ipfsHash, {from: Web3Service.getCurrentAccount(), gas: 4700000}
            var deferred = $q.defer();
            var Channel = ChannelContract.at(channelAddress);
            var submitPost = Channel.broadcast(ipfsHash, args, 
            function(err, txHash){
                if(!err){
                    var Channel = ChannelContract.at(channelAddress);
                    console.log("Watching events for", channelAddress);
                    var watcher = Channel.allEvents().watch(
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
        getChannelInfo: function(channelAddress){
            var deferred = $q.defer();
            
            var Channel = ChannelContract.at(channelAddress);
            var async_getChannelInfo = Channel.getChannelInfo(
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