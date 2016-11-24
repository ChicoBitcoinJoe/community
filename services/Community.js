Community.service('Community', ['$q','ShareService','ShardService','IpfsService','Web3Service',
function ($q,ShareService,ShardService,IpfsService,Web3Service) {
    console.log('Loading Community');
    
    var CommunityDB = null; //JSON.parse(localStorage.getItem('CommunityDB'));
    if(!CommunityDB){
        CommunityDB = {};
        CommunityDB.communities = {};
        CommunityDB.activeView = [];
    }
    
    var touchCommunity = function(community){
        if(!CommunityDB.communities[community]){
            console.log(community + ' does not exists.');
            CommunityDB.communities[community] = {};
            CommunityDB.communities[community].posts = [];
            CommunityDB.communities[community].last_block = 0;
        } else {
            console.log(community + ' exists.');
            return false;
        }
        
        return true;
    };
    
    var addExistingToActiveView = function(community){
        var posts = CommunityDB.communities[community].posts;
        for(post in posts){
            if(CommunityDB.activeView.indexOf(posts[post]) == '-1'){
                console.log("Pushing " + posts[post] + "to activeView");
                CommunityDB.activeView.push(posts[post]);
            }
        }
    };
    
    var addNewToActiveView = function(event){
        if(CommunityDB.activeView.indexOf(event.transactionHash) == '-1'){
            console.log("Pushing " + event.transactionHash + "to activeView");
            CommunityDB.activeView.push(event.transactionHash);
        }
    };
    
    var addNewToCommunity = function(event){
        
    };
    
    var postIsValid = function(post){
        var deferred = $q.defer();
        if(post.media && post.title && post.community && post.poster && (post.link || post.comment)){
            var async_getIpfsHash = IpfsService.getIpfsHash(post).then(
            function(ipfsHash){
                deferred.resolve(ipfsHash);
            }, function(err){
               deferred.reject(err); 
            });
        }
        deferred.resolve(false);
        
        return deferred.promise;
    };
    
    var service = {
        getPosts: function(communities){
            for(index in communities){
                var community = communities[index]; 
                touchCommunity(community);
                addExistingToActiveView(community);
                
                var from = CommunityDB.communities[community].last_block;
                var async_getAddress = ShareService.getShardAddress(community).then(
                function(communityAddress){
                    ShardService.getShardEvents(communityAddress, {fromBlock:from}).then(
                    function(events){
                        console.log(events);
                        for(index in events){
                            //console.log(events[index]);
                            addNewToCommunity(events[index]);
                            addNewToActiveView(events[index]);
                        }

                        console.log(CommunityDB.activeView);
                        localStorage.setItem('CommunityDB',JSON.stringify(Community));
                    }, function(err){
                        console.log(err);
                    });
                }, function(err){
                    console.error(err);
                });
            }
            console.log(CommunityDB.activeView);
            return CommunityDB.activeView;
        },
        submitPost: function(post){
            var deferred = $q.defer();
            
            var async_ipfsHash = postIsValid(post).then(
            function(ipfsHash){
                var async_shardAddress = ShareService.getShardAddress(post.community).then(
                function(shardAddress){
                    var estimatedGas = 4700000;
                    ShardService.broadcast(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
                    function(receipt){
                        console.log(receipt);
                        deferred.resolve(receipt.transactionHash);
                    }, function(err) {
                        deferred.reject(err);
                    });
                }, function(err){
                    deferred.reject(err);
                });
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        },
        createCommunity: function(shardName){
            return ShareService.createShard(shardName);
        },
        communityExists: function(community){
            var deferred = $q.defer();
            
            var async = ShareService.getShardAddress(community).then(
            function(communityAddress){
                if(communityAddress){
                    deferred.resolve(true)
                } else {
                    deferred.resolve(false);
                }
            }, function(err){
                deferred.reject(err);
            })
            
            return deferred.promise;
        },
        
    }
    
    return service;
}]);