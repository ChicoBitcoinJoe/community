Community.service('Community', ['$q','ShareService','ShardService','IpfsService','Web3Service','ProfileDB',
function ($q,ShareService,ShardService,IpfsService,Web3Service,ProfileDB) {
    console.log('Loading Community');
    
    var CommunityDB;
    var localCommunityDB = localStorage.getItem('CommunityDB');
    if(!localCommunityDB){
        CommunityDB = {};
        CommunityDB.communities = {};
        CommunityDB.activeView = [];
        
        localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
    } else {
        CommunityDB = JSON.parse(localCommunityDB);
    }
    
    var touchCommunity = function(community){
        //var communities = Object.keys(CommunityDB.communities);
        //var exist = communities.indexOf(community);
        if(!CommunityDB.communities[community]){
            CommunityDB.communities[community] = {};
            CommunityDB.communities[community].posts = [];
            CommunityDB.communities[community].comments = {};
            CommunityDB.communities[community].posters = {};
            CommunityDB.communities[community].last_block = 0;
        }
    };
    
    var addCommentToParent = function(community,txHash,parent){
        touchCommentList(community,parent);
        
        var comments = CommunityDB.communities[community].comments[parent];
        var parentIndex = comments.indexOf(txHash);
        if(parentIndex == '-1'){
            comments.push(txHash);
            //console.log("Adding " + txHash + " to parent " + parent + " in " + community);
        } else {
            //console.log(txHash + " already added to parent " + parent + " in " + community);
        }
    };
    
    var touchCommentList = function(community,txHash){
        if(!CommunityDB.communities[community].comments[txHash]){
            CommunityDB.communities[community].comments[txHash] = [];
            //console.log("Started a comment list for " + txHash);
        } else {
            //console.log("Comment list for " + txHash + " already exists");
        }
    };
    
    var touchPosterList = function(community,txHash){
        if(!CommunityDB.communities[community].posters[txHash]){
            CommunityDB.communities[community].posters[txHash] = [];
            //console.log("Started a poster list for " + txHash);
        } else {
            //console.log("Poster list for " + txHash + " already exists");
        }
    };
    
    var addExistingToActiveView = function(community){
        touchCommunity(community);
        
        var posts = CommunityDB.communities[community].posts;
        for(post in posts){
            if(CommunityDB.activeView.indexOf(posts[post]) == '-1'){
                //console.log("Pushing " + posts[post] + "to activeView");
                CommunityDB.activeView.push(posts[post]);
            }
        }
    };
    
    var addTxHashToActiveView = function(event){
        if(CommunityDB.activeView.indexOf(event.transactionHash) == '-1'){
            //console.log("Pushing " + event.transactionHash + "to activeView");
            CommunityDB.activeView.push(event.transactionHash);
        }
    };
    
    var addPostToCommunity = function(community,txHash){
        if(CommunityDB.communities[community].posts.indexOf(txHash) == '-1'){
            CommunityDB.communities[community].posts.push(txHash);
            //console.log("Pushing " + txHash + " to post list " + community);
        } else {
            //console.log(txHash + " already in "  + community + " post list.");
        }  
    };
    
    var addTxHashToCommunity = function(community,event){
        //console.log(event);
        touchCommunity(community);
        
        var ipfsHash = event.args.ipfsHash;
        IpfsService.getIpfsData(ipfsHash).then(
        function(ipfsData){
            //console.log(event,ipfsData);
            if(postIsValid(ipfsData)){
                //console.log("post");
                touchCommentList(community,event.transactionHash);
                addTxHashToActiveView(event);
                addPostToCommunity(community,event.transactionHash);
                addPosterToPost(community,event.transactionHash,event.args.sender);
                service.updatePostScore(community,event.transactionHash);
            } else if(commentIsValid(ipfsData)){
                //console.log("comment");
                touchCommentList(community,event.transactionHash);
                console.log(ipfsData.parent);
                addCommentToParent(community,event.transactionHash,ipfsData.parent);
                addPosterToPost(community,ipfsData.root_parent,ipfsData.poster);
                service.updatePostScore(community,ipfsData.root_parent);
            }
        });
    };
    
    var postIsValid = function(post){
        if(post.media && post.title && post.community && post.poster && (post.link || post.comment))
            return true;
        else 
            return false;
    };
    
    var commentIsValid = function(comment){
        if(comment.community && comment.poster && comment.comment && comment.parent && comment.root_parent && !comment.title)
            return true;
        else
            return false;
    };
    
    var addPosterToPost = function(community, txHash, poster){
        console.log(community,txHash,poster);
        if(!CommunityDB.communities[community].posters[txHash])
            CommunityDB.communities[community].posters[txHash] = [];
            
        if(CommunityDB.communities[community].posters[txHash].indexOf(poster) == -1 && poster !== null)
            CommunityDB.communities[community].posters[txHash].push(poster);  
    };
    
    var service = {
        getPosts: function(communities){
            CommunityDB.activeView = [];
            
            for(index in communities){
                var community = communities[index]; 
                addExistingToActiveView(community);
                
                var from = CommunityDB.communities[community].last_block;
                var async_getAddress = ShareService.getShardAddress(community).then(
                function(communityAddress){
                    ShardService.getShardEvents(communityAddress, {fromBlock:from}).then(
                    function(events){
                        for(index in events){
                            //console.log(events[index]);
                            localStorage.setItem(events[index].transactionHash,JSON.stringify(events[index]));
                            addTxHashToCommunity(community,events[index]);
                        }
                        localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
                    }, function(err){
                        console.error(err);
                    });
                }, function(err){
                    console.error(err);
                });
            }
            
            return CommunityDB.activeView;
        },
        getChildren: function(community,txHash){
            touchCommunity(community);
            touchCommentList(community,txHash);
            
            return CommunityDB.communities[community].comments[txHash];
        },
        submitPost: function(post){
            var deferred = $q.defer();
            
            if(postIsValid(post)){
                var async_getIpfsHash = IpfsService.getIpfsHash(post).then(
                function(ipfsHash){
                    console.log(ipfsHash);
                    var async_shardAddress = ShareService.getShardAddress(post.community).then(
                    function(shardAddress){
                        var estimatedGas = 4700000;
                        ShardService.share(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
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
        submitComment: function(comment){
            var deferred = $q.defer();
            if(commentIsValid(comment)){
                var async_getIpfsHash = IpfsService.getIpfsHash(comment).then(
                function(ipfsHash){
                    console.log(ipfsHash);
                    var async_shardAddress = ShareService.getShardAddress(comment.community).then(
                    function(shardAddress){
                        var estimatedGas = 4700000;
                        ShardService.share(shardAddress,ipfsHash,{from:Web3Service.getCurrentAccount(), gas:estimatedGas}).then(
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
        getPosters: function(community,txHash){
            touchCommunity(community);
            //console.log(CommunityDB.communities[community].posters[txHash]);
            if(Object.keys(CommunityDB.communities[community].posters).indexOf(txHash) == -1)
                CommunityDB.communities[community].posters[txHash] = [];
                
            return CommunityDB.communities[community].posters[txHash];
        },
        updatePostScore: function(community,txHash){
            touchCommunity(community);
            touchPosterList(community,txHash);
            
            var posters = CommunityDB.communities[community].posters[txHash];
            //console.log(posters);
            var score = 0;
            for(poster in posters){
                score += ProfileDB.getUserScore(posters[poster]);
                //console.log("updating post score to " + score);
            }
            
            ProfileDB.updatePostScore(community,txHash,score);
        }
    }
    
    return service;
}]);