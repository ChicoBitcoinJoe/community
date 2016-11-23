Community.service('Community', ['$q','LinkDB','IpfsService','ProfileDB', function ($q, LinkDB, IpfsService, ProfileDB) {
    console.log('Loading Community');
    
    var Community = JSON.parse(localStorage.getItem('CommunityDB'));
    if(!Community){
        var Community = {
            communities:{},
            active:{
                posts:[]
            },
            posters:{}
        };
    
        localStorage.setItem('CommunityDB',JSON.stringify(Community));
    }
    
    var postIsValid = function(post){
        return post.media && post.title && post.community && post.poster && (post.link || post.comment);
    };
    
    var commentIsValid = function(comment){
        return comment.community && comment.poster && comment.comment && comment.parent && !comment.title;
    };
    
    var handlePoster = function(ipfsHash, poster){
        if(Object.keys(Community.posters).indexOf(ipfsHash) == -1)
            Community.posters[ipfsHash] = [];
        
        if(Community.posters[ipfsHash].indexOf(poster) !== '1')
            Community.posters[ipfsHash].push(poster);
        
    };
    
    var handlePostScore = function(ipfsHash, poster){
        if(Community.posters[ipfsHash].indexOf(poster) == -1){
            Community.posters[ipfsHash].push(poster);
        }
    };
    
    var addToActivePosts = function(ipfsHash){
        var index = Community.active.posts.indexOf(ipfsHash);
        if(index == '-1')
            Community.active.posts.push(ipfsHash);
    };
    
    var addPostToCommunities = function(ipfsHash,ipfsData){
        var community = ipfsData.community;
        var keys = Object.keys(Community.communities);
        var index = keys.indexOf(community);
        if(index == '-1'){
            Community.communities[community] = {};
            Community.communities[community].comments = {};
            Community.communities[community].comments[ipfsHash] = [];
            Community.communities[community].posts = [];
            Community.communities[community].lastBlock = null;
        }
        
        if(Community.communities[ipfsData.community].posts.indexOf(ipfsHash) == '-1'){
            Community.communities[ipfsData.community].posts.push(ipfsHash);
            console.log("Pushing " + ipfsHash + " to post list " + ipfsData.community);
        } else {
            cosole.log(ipfsHash + " already in "  + ipfsData.community + " post list.");
        }  
    };
    
    var createCommentSection = function(ipfsHash,ipfsData){
        if(!Community.communities[ipfsData.community].comments[ipfsHash]){
            Community.communities[ipfsData.community].comments[ipfsHash] = [];
            console.log("Started a comment list for " + ipfsHash);
        } else {
            console.log("Comment list for " + ipfsHash + " already exists");
        }  
    };
    
    var addCommentToParent = function(ipfsHash,ipfsData){
        var comments = Community.communities[ipfsData.community].comments[ipfsData.postParent];
        var parentIndex = comments.indexOf(ipfsHash);
        if(parentIndex == '-1'){
            comments.push(ipfsHash);
            console.log("Adding " + ipfsHash + " to parent " + ipfsData.postParent + " in " + ipfsData.community);
        } else {
            console.log(ipfsHash + " already added to parent " + ipfsData.postParent + " in " + ipfsData.community);
        }
    };
    
    var parseEvent = function(event){
        var ipfsHash = event.args.ipfsHash;
        IpfsService.getIpfsData(ipfsHash).then(
        function(ipfsData){
            console.log(ipfsData);
            var data = {
                eventData:{
                    sender:event.args.sender,
                    ipfsHash:ipfsHash,
                    address:event.address,
                    txHash:event.transactionHash
                },
                ipfsData:ipfsData,
                comments:[],
                commmenters:[],
                type:'invalid'
            };
            console.log(data);
            
            if(postIsValid(ipfsData)){
                console.log("Post:",data);
                data.type = 'post';
                handlePoster(ipfsHash,ipfsData.poster);
                handlePostScore(ipfsHash,ipfsData.poster);
                addToActivePosts(ipfsHash);
                addPostToCommunities(ipfsHash,ipfsData);
                createCommentSection(ipfsHash,ipfsData);
                
            } else if(commentIsValid(ipfsData)){
                console.log("Comment:",data);
                data.type = 'comment';
                handlePoster(ipfsData.postRootParent,data.eventData.sender);
                handlePostScore(ipfsHash,ipfsData.poster);
                addCommentToParent(ipfsHash,ipfsData);
                createCommentSection(ipfsHash,ipfsData);
            } else {
                console.log("Invalid event.");
            }
            
            localStorage.setItem(data.eventData.txHash,JSON.stringify(data));
        }, function(err){
            console.error(err);
        });
    }
    
    var service = {
        submitPost: function(post){
            var deferred = $q.defer();
   
           if(postIsValid(post)){
                LinkDB.broadcast(post).then(
                function(ipfsHash){
                    console.log(ipfsHash);
                    deferred.resolve(ipfsHash);
                }, function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject('Not a valid post.');
            }
            
            return deferred.promise;
        },
        submitComment: function(comment){
            var deferred = $q.defer();
            console.log(comment);
            if(commentIsValid(comment)){
                LinkDB.broadcast(comment).then(
                function(ipfsHash){
                    console.log(ipfsHash);
                    deferred.resolve(ipfsHash);
                }, function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject('Not a valid comment.');
            }
            
            return deferred.promise;
        },
        communityExists: function(community){
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
            
            //If a community does not exist create it otherwise get the local posts and add to active posts
            for(index in communities){
                var keys = Object.keys(Community.communities);
                var exists = keys.indexOf(communities[index]);
                var community = Community.communities[communities[index]];
                if(exists == '-1'){
                    community = {};
                    community.comments = {};
                    community.posts = [];
                    community.lastBlock = null;
                } else {
                    for(post in community.posts){
                        if(Community.active.posts.indexOf(community.posts[post]) == '-1')
                            Community.active.posts.push(community.posts[post]);
                    }
                }
                localStorage.setItem('CommunityDB',JSON.stringify(Community));
            }
            
            console.log('Active Posts before lookup',Community.active.posts);
            
            for(index in communities){
                console.log("Getting posts from " + communities[index]);
                //Add events from each community
                LinkDB.getShardEvents(communities[index]).then(
                function(events){
                    console.log(events);
                    for(index in events){
                        parseEvent(events[index]);
                    }
                    console.log('Active Posts after look up',Community.active.posts);
                    localStorage.setItem('CommunityDB',JSON.stringify(Community));
                }, function(err){
                    console.log(err);
                });
            }
            
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
        },
        getPosters: function(ipfsHash){
            handlePoster(ipfsHash);
            return Community.posters[ipfsHash];
        }
    }
    
    return service;
}]);