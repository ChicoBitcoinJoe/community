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
    
    var active = {view:[]};
    
    var touchCommunity = function(community){
        if(!CommunityDB.communities[community]){
            CommunityDB.communities[community] = {};
            CommunityDB.communities[community].posts = [];
            CommunityDB.communities[community].comments = {};
            CommunityDB.communities[community].posters = {};
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
        if(active.view.indexOf(txHash) == -1)
            active.view.push(txHash);
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
            
            //console.log(active.view);
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
            active.view = [];
            //console.log(communities);
            for(var index in communities){
                var community = communities[index];
                touchCommunity(community);
                
                SharePlatform.getChannelEvents(community).then(
                function(args){
                    var community = args[0];
                    var events = args[1];
                    //console.log(community,events);
                    for(var index in events){
                        var txHash = events[index].transactionHash;
                        var ipfsHash = events[index].args.hash;
                        
                        var local = localStorage.getItem(txHash);
                        if(!local)
                            localStorage.setItem(txHash,JSON.stringify(events[index]));
                        
                        //console.log(community,events[index],ipfsHash);
                        addTxToCommunityDB(community,events[index],ipfsHash);
                    }
                    
                    console.log("Found " + Object.keys(events).length + " events in " + community, active.view);
                    localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
                }, function(err){
                    //This community does not exist
                    //console.log(err);
                });
            }
            
            return active.view;
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
                    var async_shardAddress = SharePlatform.getChannelAddress(post.community).then(
                    function(shardAddress){
                        var estimatedGas = 4700000;
                        SharePlatform.broadcast(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
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
                    var async_shardAddress = SharePlatform.getChannelAddress(comment.community).then(
                    function(shardAddress){
                        var estimatedGas = 4700000;
                        SharePlatform.broadcast(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
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
            return SharePlatform.createChannel(shardName);
        },
        communityExists: function(community){
            var deferred = $q.defer();
            
            var async = SharePlatform.getChannelAddress(community).then(
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
            if(local){
                var event = JSON.parse(local);
                var communityAddress = event.address;
                SharePlatform.getChannelInfo(communityAddress).then(
                function(info){
                    var args = {};
                    args.event = event;
                    args.communityName = info[0];
                    deferred.resolve(args);
                });
            } else {
                deferred.reject("Haven't seen this tx event");
                //Todo: fetch from blockchain
            }
            
            return deferred.promise;
        }
    }
    
    return service;
}]);