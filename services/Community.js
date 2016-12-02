Community.service('Community', ['$q','ShareService','ShardService','IpfsService','Web3Service','ProfileDB',
function ($q,ShareService,ShardService,IpfsService,Web3Service,ProfileDB) {
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
            console.log(community + " touched!");
        }
    };
    
    
    var touchCommentList = function(community,txHash){
        console.log(community,txHash);
        if(Object.keys(CommunityDB.communities[community].comments).indexOf(txHash) == -1){
            CommunityDB.communities[community].comments[txHash] = [];
            console.log("Comment list for " + txHash + " created");
        } else {
            console.log("Comment list for " + txHash + " already exists");
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
    
    var addCommentToParent = function(community,txHash,parent){
        console.log(JSON.stringify(community),txHash,parent);
        touchCommunity(community);
        touchCommentList(community,parent);
        
        var comments = CommunityDB.communities[community].comments[parent];
        var parentIndex = comments.indexOf(txHash);
        console.log(comments,parentIndex);
        if(parentIndex == -1){
            comments.push(txHash);
            //console.log("Adding " + txHash + " to parent " + parent + " in " + community);
            console.log(JSON.stringify(CommunityDB));
        } else {
            console.log(txHash + " already added to parent " + parent + " in " + community);
        }
    };
    
    var addExistingToActiveView = function(community){
        console.log(JSON.stringify(community));
        touchCommunity(community);
        var posts = CommunityDB.communities[community].posts;
        for(post in posts){
            if(activeView.indexOf(posts[post]) == -1){
                //console.log("Pushing " + posts[post] + "to activeView");
                activeView.push(posts[post]);
            }
        }
    };
    
    var addTxHashToActiveView = function(event){
        if(activeView.indexOf(event.transactionHash) == -1){
            activeView.push(event.transactionHash);
        }
    };
    
    var addPostToCommunity = function(community,txHash){
        if(CommunityDB.communities[community].posts.indexOf(txHash) == -1){
            CommunityDB.communities[community].posts.push(txHash);
            //console.log("Pushing " + txHash + " to post list " + community);
        } else {
            //console.log(txHash + " already in "  + community + " post list.");
        }  
    };
    
    var addTxHashToCommunity = function(community,event){
        console.log(community,event);
        
        console.log(JSON.stringify(community));
        touchCommunity(community);
        
        var ipfsHash = event.args.ipfsHash;
        IpfsService.getIpfsData(ipfsHash).then(
        function(ipfsData){
            //console.log(event,ipfsData);
            if(service.postIsValid(ipfsData)){
                console.log("post");
                touchCommentList(community,event.transactionHash);
                addTxHashToActiveView(event);
                addPostToCommunity(community,event.transactionHash);
                addPosterToPost(community,event.transactionHash,event.args.sender);
                service.updatePostScore(community,event.transactionHash);
            } else if(service.commentIsValid(ipfsData)){
                console.log("comment");
                touchCommentList(community,event.transactionHash);
                console.log(ipfsData.parent);
                addCommentToParent(community,event.transactionHash,ipfsData.parent);
                addPosterToPost(community,ipfsData.root_parent,ipfsData.poster);
                service.updatePostScore(community,ipfsData.root_parent);
            } else {
                console.log("Invalid event");
            }
        });
    };
    
    var addPosterToPost = function(community, txHash, poster){
        //console.log(community,txHash,poster);
        if(!CommunityDB.communities[community].posters[txHash])
            CommunityDB.communities[community].posters[txHash] = [];
            
        if(CommunityDB.communities[community].posters[txHash].indexOf(poster) == -1 && poster !== null)
            CommunityDB.communities[community].posters[txHash].push(poster);  
    };
    
    var service = {
        postIsValid: function(post){
            if(post.media && post.title && post.community && post.poster && (post.link || post.comment))
                return true;
            else 
                return false;
        },
        commentIsValid: function(comment){
            if(comment.community && comment.poster && comment.comment && comment.parent && comment.rootParent && !comment.title)
                return true;
            else
                return false;
        },
        getPosts: function(communities){
            console.log(CommunityDB);
            activeView = [];
            
            for(var coms in communities){
                var community = communities[coms];
                touchCommunity(community);
                
                //add already fetched event txs
                
                var fromBlock = CommunityDB.communities[community].last_block;
                ShareService.getEvents(community,fromBlock).then(function(events){
                    //console.log(activeView);
                    for(var index in events){
                        //console.log(events);
                        localStorage.setItem(events[index].transactionHash,JSON.stringify(events[index]));
                        addTxHashToActiveView(events[index]);
                        
                        //console.log(eventData);
                        var ipfsHash;
                        var communityName;
                        var event = events[index];
                        console.log(event);
                        //This is an event from X (geth or parity?)
                        if(Object.keys(events[index]).indexOf('args') !== -1){
                            ipfsHash = events[index].args.ipfsHash;
                            communityName = events[index].args.shardName;
                        } //This is an event from Y (geth or parity?) 
                        else if(Object.keys(events[index]).indexOf('data') !== -1){
                            //This is going to cause bugs Guaranteed!!!
                            //Needs a better solution asap
                            var data = events[index].data;//.slice(2,length).replace(/^0+/, '');
                            var tempIpfsHash = web3.toAscii(data);
                            var index = tempIpfsHash.indexOf('Qm');
                            var length = tempIpfsHash.length;
                            ipfsHash = tempIpfsHash.slice(index,index+46);

                            var tempCommunityName = web3.toAscii(data);
                            var tindex = tempCommunityName.indexOf('@');
                            var windex = tempCommunityName.indexOf('Qm');
                            tempCommunityName = tempCommunityName.slice(tindex+1,windex-1);
                            tempCommunityName = JSON.stringify(tempCommunityName).replace(/\\u0000/g, "");
                            tempCommunityName = tempCommunityName.replace(/\\t/g, "");
                            var length = tempCommunityName.length;
                            tempCommunityName = tempCommunityName.slice(1,length-1);
                            communityName = tempCommunityName;
                        } else {
                            console.error("Cannot recognize event data");
                        }
                        
                        console.log(communityName);

                        var async_ipfsData = IpfsService.getIpfsData(ipfsHash).then(
                        function(ipfsData){
                            if(service.postIsValid(ipfsData)){
                                
                            } else if(service.commentIsValid(ipfsData)){
                                //add comment to parents comment list
                                console.log(CommunityDB);
                                
                                console.log(community);
                                addCommentToParent(communityName,event.transactionHash,ipfsData.parent);
                                
                                //localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
                            } else {
                                console.error("Cannot recognize ipfs data format...");
                            }
                        }, function(err){
                            console.error(err); 
                        });
                        
                        //Update latest block
                    }
                    //localStorage.setItem('ActiveView',JSON.stringify(activeView));
                    console.log(activeView);
                }, function(err){
                    console.log(err);
                });
            
                /*
                addExistingToActiveView(community);
                var async_getAddress = ShareService.getShardAddress(community).then(
                function(communityAddress){
                    console.log(community);
                    console.log("Fetching last 30 days of events");
                    ShardService.getShardEvents(communityAddress, {fromBlock:from}).then(
                    function(events){
                        console.log("Finished fetching last 30 days of events");
                        var com = community;
                        console.log(com);
                        for(index in events){
                            console.log(community);
                            console.log(com);

                            localStorage.setItem(events[index].transactionHash,JSON.stringify(events[index]));
                            addTxHashToCommunity(community,events[index]);
                        }
                        localStorage.setItem('CommunityDB',JSON.stringify(CommunityDB));
                        console.log("Finished loading last 30 days of events");
                    }, function(err){
                        console.error(err);
                    });
                }, function(err){
                    console.error(err);
                });
                */
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
            if(service.commentIsValid(comment)){
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
            console.log(JSON.stringify(community));
            touchCommunity(community);
            //console.log(CommunityDB.communities[community].posters[txHash]);
            if(Object.keys(CommunityDB.communities[community].posters).indexOf(txHash) == -1)
                CommunityDB.communities[community].posters[txHash] = [];
                
            return CommunityDB.communities[community].posters[txHash];
        },
        updatePostScore: function(community,txHash){
            console.log(JSON.stringify(community));
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