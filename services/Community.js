Community.service('Community', ['$q','LinkDB','IpfsService', function ($q, LinkDB, IpfsService) {
    console.log('Loading Community');
    
    var Community = JSON.parse(localStorage.getItem('CommunityDB'));
    if(!Community){
        var Community = {
            communities:{},
            active:{
                posts:[]
            }
        };
    
        localStorage.setItem('CommunityDB',JSON.stringify(Community));
    }
    
    var postIsValid = function(post){
        return post.postType && !post.postParent && post.postTitle && post.postCommunity && post.poster &&(post.postLink || post.postComment);
    }
    
    var commentIsValid = function(post){
        return post.postCommunity && post.poster && post.postComment && post.postParent && !post.postTitle;
    }
    
    var sortEvent = function(event){
        console.log(event);
        var ipfsHash = event.args.ipfsHash;
        IpfsService.getIpfsData(ipfsHash).then(
        function(post){
            if(postIsValid(post)){
                console.log("Post event");
                
                var index = Community.active.posts.indexOf(ipfsHash);
                if(index == '-1')
                    Community.active.posts.push(ipfsHash);
                
                if(Community.communities[post.postCommunity].posts.indexOf(ipfsHash) == '-1'){
                    Community.communities[post.postCommunity].posts.push(ipfsHash);
                    console.log("Pushing " + ipfsHash + " to post list " + post.postCommunity);
                } else {
                    console.log(ipfsHash + " already in "  + post.postCommunity + " post list.");
                }

                if(!Community.communities[post.postCommunity].comments[ipfsHash]){
                    Community.communities[post.postCommunity].comments[ipfsHash] = [];
                    console.log("Started a comment list for " + ipfsHash);
                } else {
                    console.log("Comment list for " + ipfsHash + " already exists");
                }

                console.log(Community);
            } else if(commentIsValid(post)){
                console.log("Comment event");
               
                var parentIndex = Community.communities[post.postCommunity].comments[post.postParent].indexOf(ipfsHash);
                if(parentIndex == '-1'){
                    Community.communities[post.postCommunity].comments[post.postParent].push(ipfsHash);
                    console.log("Adding " + ipfsHash + " to parent " + post.postParent + " in " + post.postCommunity);
                } else {
                    console.log(ipfsHash + " already added to parent " + post.postParent + " in " + post.postCommunity);
                }

                if(!Community.communities[post.postCommunity].comments[ipfsHash]){
                    Community.communities[post.postCommunity].comments[ipfsHash] = [];
                    console.log("Creating comment list for " + ipfsHash);
                } else {
                    console.log("Comment list for " + ipfsHash + " already exists");
                }

                console.log(Community);
            } else {
                console.log("Invalid event.");
            }
        }, function(err){
            console.error(err);
        });
    }
    
    var service = {
        submitPost: function(post){
            var deferred = $q.defer();
   
            if(post.postType && post.postTitle && post.postCommunity && post.poster &&(post.postLink || post.postComment)){
                //Add to ipfs
                var promise_ipfsHash = IpfsService.getIpfsHash(post)
                .then(function (ipfsHash) {
                    console.log(ipfsHash, web3.eth.accounts[0]);
                    var asyncShardAddress = LinkDB.getShardAddress(post.postCommunity).then(
                    function(shardAddress){
                        var Shard = LinkDB.getShardInstance(shardAddress);
                        var submitPost = Shard.broadcast(ipfsHash, {from: web3.eth.accounts[0], gas: 4700000}, 
                        function(err, txHash){
                            if(!err)
                                deferred.resolve(ipfsHash);
                            else
                                deferred.reject(err);
                        });   
                    }, function(err){
                        deferred.reject(err);
                    });
                    
                }, function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(false);
            }
            
            return deferred.promise;
        },
        submitComment: function(post){
            var deferred = $q.defer();
   
            if(post.postCommunity && post.poster && post.postComment && post.postParent){
                //Add to ipfs
                var promise_ipfsHash = IpfsService.getIpfsHash(post)
                .then(function (ipfsHash) {
                    console.log(ipfsHash, web3.eth.accounts[0]);
                    var asyncShardAddress = LinkDB.getShardAddress(post.postCommunity).then(
                    function(shardAddress){
                        var Shard = LinkDB.getShardInstance(shardAddress);
                        var submitPost = Shard.broadcast(ipfsHash, {from: web3.eth.accounts[0], gas: 4700000}, 
                        function(err, txHash){
                            if(!err)
                                deferred.resolve(txHash);
                            else
                                deferred.reject(err);
                        });   
                    }, function(err){
                        deferred.reject(err);
                    });
                    
                }, function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(false);
            }
            
            return deferred.promise;
        },
        exists: function(community){
            var deferred = $q.defer();
            
            var async = LinkDB.getShardAddress(community).then(
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
        getPosts: function(communities){
            Community.active.posts = [];
            
            for(index in communities){
                var keys = Object.keys(Community.communities);
                var qindex = keys.indexOf(communities[index]);
                if(qindex == '-1'){
                    Community.communities[communities[index]] = {};
                    Community.communities[communities[index]].comments = {};
                    Community.communities[communities[index]].posts = [];
                    Community.communities[communities[index]].lastBlock = null;
                    localStorage.setItem('CommunityDB',JSON.stringify(Community));
                } else {
                    for(windex in Community.communities[communities[index]].posts){
                        if(Community.active.posts.indexOf(Community.communities[communities[index]].posts[windex]))
                            Community.active.posts.push(Community.communities[communities[index]].posts[windex]);
                    }
                }
            }
            
            console.log(Community.active.posts);
            
            for(index in communities){
                console.log("Getting posts from " + communities[index]);
                //Add events from each community
                LinkDB.getEvents(communities[index]).then(
                function(Shard){
                    var async_events = Shard.get(function(err,events){
                        if(!err){
                            for(index in events){
                                sortEvent(events[index]);
                            }
                            console.log(Community);
                            localStorage.setItem('CommunityDB',JSON.stringify(Community));
                        } else {
                            console.log(err);
                        }
                    });
                }, function(err){
                    console.log(err);
                });
            }
            console.log(Community);
            return Community.active.posts;
        },
        getChildren: function(community,ipfsHash){
            var keys = Object.keys(Community.communities);
            var index = keys.indexOf(community);
            if(index == '-1'){
                Community.communities[community] = {};
                Community.communities[community].comments = {};
                Community.communities[community].comments[ipfsHash] = [];
                Community.communities[community].posts = [];
                Community.communities[community].lastBlock = null;
                localStorage.setItem('CommunityDB',JSON.stringify(Community));
            }
            console.log(Community.communities[community]);
            
            return Community.communities[community];
        },
        createCommunity: function(shardName){
            return LinkDB.createShard(shardName);
        }
    }
    
    return service;
}]);