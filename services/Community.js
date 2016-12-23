Community.service('Community', ['$q','SharePlatform','IpfsService','Web3Service','ProfileDB',
function ($q,SharePlatform,IpfsService,Web3Service,ProfileDB) {
    console.log('Loading Community');
    
    var CommunityDB;
    var localCommunityDB = null;//localStorage.getItem('CommunityDB');
    if(!localCommunityDB){
        CommunityDB = {};
        CommunityDB.communities = {};
        
        localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
    } else {
        CommunityDB = JSON.parse(localCommunityDB);
    }
    
    var activeView = [];
    
    var touchCommunity = function(community){
        if(!CommunityDB.communities[community]){
            CommunityDB.communities[community] = {};
            CommunityDB.communities[community].posts = [];
            CommunityDB.communities[community].comments = {};
            CommunityDB.communities[community].posters = {};
            CommunityDB.communities[community].last_block = 0;
            //console.log(community + " touched!");
        }
    };
    
    var touchCommentList = function(community,txHash){
        if(Object.keys(CommunityDB.communities[community].comments).indexOf(txHash) == -1)
            CommunityDB.communities[community].comments[txHash] = [];
    };
    
    var touchPosterList = function(community,txHash){
        if(!CommunityDB.communities[community].posters[txHash])
            CommunityDB.communities[community].posters[txHash] = [];
    };
    
    var addCommentToParent = function(community,txHash,parent){
        touchCommentList(community,parent);

        var comments = CommunityDB.communities[community].comments[parent];
        if(comments.indexOf(txHash) == -1)
            comments.push(txHash);
    };
    
    var addTxHashToActiveView = function(txHash){
        if(activeView.indexOf(txHash) == -1)
            activeView.push(txHash);
    };
    
    var addPostToCommunityDB = function(community,txHash){
        if(CommunityDB.communities[community].posts.indexOf(txHash) == -1)
            CommunityDB.communities[community].posts.push(txHash);
    };
    
    var addTxToCommunityDB = function(community,event,ipfsHash){
        //console.log(community,event,ipfsHash);
        touchCommunity(community);
        var txHash = event.transactionHash;
        
        IpfsService.getIpfsData(ipfsHash).then(
        function(ipfsData){
            //console.log(ipfsData);
            //addExistingTxsToActive();
            
            if(service.postIsValid(ipfsData)){
                //console.log("post");
                touchCommentList(community,txHash);
                addTxHashToActiveView(txHash);
                addPosterToRootParent(community,txHash,event.args.sender);
            } else if(service.commentIsValid(ipfsData)){
                //console.log("comment");
                touchCommentList(community,ipfsData.parent);
                touchCommentList(community,txHash);
                addCommentToParent(community,txHash,ipfsData.parent);
                addPosterToRootParent(community,ipfsData.rootParent,event.args.sender);
            } else {
                console.log("Invalid event");
            }
            
            //console.log(activeView);
        }, function(err){
            console.error(err);
        });
    };
    
    var addPosterToRootParent = function(community, rootParentTxHash, poster){
        touchCommunity(community);
        touchPosterList(community,rootParentTxHash);
        
        var posters = CommunityDB.communities[community].posters[rootParentTxHash];
        if(posters.indexOf(poster) == -1){
            posters.push(poster);  
            ProfileDB.updatePostScore(community,rootParentTxHash,posters);
        }
    };
    
    var service = {
        postIsValid: function(post){
            if(post.media && post.title && post.community && post.poster && (post.link || post.comment))
                return true;
            else 
                return false;
        },
        commentIsValid: function(comment){
            if(comment.community && comment.poster && comment.comment && comment.parent && comment.rootParent)
                return true;
            else
                return false;
        },
        getPosts: function(communities){
            activeView = [];
            
            for(var coms in communities){
                var community = communities[coms];
                touchCommunity(community);
                
                //add already fetched event txs
                
                var fromBlock = CommunityDB.communities[community].last_block;
                SharePlatform.getShardEvents(community).then(
                function(events){
                    console.log("Found " + events.length + " events", events);
                    for(var index in events){
                        var txHash = events[index].transactionHash;
                        var ipfsHash = events[index].args.ipfsHash;
                        var communityName = events[index].args.shardName;
                        
                        var local = localStorage.getItem(txHash);
                        if(!local)
                            localStorage.setItem(txHash,JSON.stringify(events[index]));
                        
                        addTxToCommunityDB(communityName,events[index],ipfsHash);
                        
                        //Update latest block
                    }
                    
                    localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
                }, function(err){
                    console.log(err);
                });
            }
            
            return activeView;
        },
        getChildren: function(community,txHash){
            touchCommunity(community);
            touchCommentList(community,txHash);
            
            return CommunityDB.communities[community].comments[txHash];
        },
        submitPost: function(post){
            var deferred = $q.defer();
            
            if(service.postIsValid(post)){
                var async_getIpfsHash = IpfsService.getIpfsHash(post).then(
                function(ipfsHash){
                    console.log(ipfsHash);
                    var async_shardAddress = SharePlatform.getShardAddress(post.community).then(
                    function(shardAddress){
                        var estimatedGas = 4700000;
                        SharePlatform.share(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
                        function(txHash){
                            deferred.resolve(txHash);
                        }, function(err) {
                            deferred.reject(err);
                        });
                    }, function(err){
                        deferred.reject(err);
                    });
                }, function(err){
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(false);
            }
            
            return deferred.promise;
        },
        submitComment: function(comment){
            var deferred = $q.defer();
            if(service.commentIsValid(comment)){
                var async_getIpfsHash = IpfsService.getIpfsHash(comment).then(
                function(ipfsHash){
                    console.log(ipfsHash);
                    var async_shardAddress = SharePlatform.getShardAddress(comment.community).then(
                    function(shardAddress){
                        var estimatedGas = 4700000;
                        SharePlatform.share(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
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
            } else {
                deferred.resolve(false);
            }
            
            return deferred.promise;
        },
        createCommunity: function(shardName){
            return SharePlatform.createShard(shardName);
        },
        communityExists: function(community){
            var deferred = $q.defer();
            
            var async = SharePlatform.getShardAddress(community).then(
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
        getPosters: function(community,txHash){
            console.log(JSON.stringify(community));
            touchCommunity(community);
            //console.log(CommunityDB.communities[community].posters[txHash]);
            if(Object.keys(CommunityDB.communities[community].posters).indexOf(txHash) == -1)
                CommunityDB.communities[community].posters[txHash] = [];
                
            return CommunityDB.communities[community].posters[txHash];
        },
        getEventData(txHash){
            var deferred = $q.defer();
            
            var local = localStorage.getItem(txHash);
            if(local)
                deferred.resolve(JSON.parse(local));
            else {
                deferred.reject("Haven't seen this tx event");
            }
            
            return deferred.promise;
        }
    }
    
    return service;
}]);