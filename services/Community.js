app.service( 'Community',['$q','$web3','$ipfs', function ($q, $web3, $ipfs) {
    console.log('Loading Community Service');

    var metadata = {"compiler":{"version":"0.4.23+commit.124ca40d"},"language":"Solidity","output":{"abi":[{"constant":false,"inputs":[{"name":"communityName","type":"string"},{"name":"postHash","type":"string"}],"name":"post","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"commentHash","type":"string"},{"name":"parentHash","type":"string"}],"name":"comment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"communityName","type":"string"},{"indexed":false,"name":"postHash","type":"string"}],"name":"Post_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"communityName","type":"bytes32"},{"indexed":true,"name":"postHash","type":"string"}],"name":"Index_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"parentHash","type":"string"},{"indexed":false,"name":"commentHash","type":"string"}],"name":"Comment_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"parentHash","type":"string"},{"indexed":true,"name":"commentHash","type":"string"}],"name":"Index_event","type":"event"}],"devdoc":{"methods":{}},"userdoc":{"methods":{}}},"settings":{"compilationTarget":{"browser/Community.sol":"Community"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":true,"runs":200},"remappings":[]},"sources":{"browser/Community.sol":{"keccak256":"0x00557517a1494dfd1bec2ebd6ec866558b7d675944fcdf38f1b0f6849d0036a7","urls":["bzzr://65a728fc764c2693005290a7e31841268feb0bb89bbdb5f06da2b2031865180f"]}},"version":1};
    
    var contractAddress = '0x96c2b9ea7028f93e44f1b31788021c12e4a8d0ec';

    var Community = web3.eth.contract(metadata.output.abi).at(contractAddress);

    var communities = {
        // community: [posts]
    };

    var posts = {
        /*txHash: {
            promise: null,
            data: null,
            comments: []
        }*/
    };

    var comments = {
        /*txHash: {
            promise: null,
            data: null,
            comments: []
        }*/
    };

    var service = {
        getPosts: function(fromBlock, toBlock, communityName, postHash){
            var deferred = $q.defer();
            
            //console.log(fromBlock, toBlock, communityName, postHash);
            var communityNameHash = web3.sha3(communityName);
            var postHashHash = web3.sha3(postHash);

            if(!communityName) communityNameHash = null;
            if(!postHash) postHashHash = null;

            var filter = web3.eth.filter({
                fromBlock: fromBlock,
                toBlock: toBlock,
                address: contractAddress,
                topics: [
                    web3.sha3('Index_event(bytes32,string)'), 
                    communityNameHash,
                    postHashHash,
                ]
            }).get((error, events) => {
                //console.log(error, events);

                var postPromises = [];
                events.forEach(log => {
                    //console.log(log);
                    postPromises.push(this.getPost(log.transactionHash));
                });

                $q.all(postPromises).then(function(posts){
                    deferred.resolve(posts);
                }).catch(function(err){
                    deferred.reject(err);
                });
            });

            return deferred.promise;
        },
        getPost: function(transactionHash){
            var deferred = $q.defer();
            
            $web3.getTransaction(transactionHash)
            .then(function(transaction){
                //console.log(transaction);
                $web3.getBlock(transaction.blockNumber).then(function(block){
                    Community.Post_event(null, {fromBlock: block.number, toBlock: transaction.number})
                    .get(function(err, events){
                        //console.log(err,events);
                        if(!err) {
                            events.forEach(event => {
                                if(event.transactionHash == transactionHash){
                                    posts[transactionHash] = {
                                        transactionHash: transactionHash,
                                        timestamp: block.timestamp,
                                        score: 100,
                                        poster: transaction.from,
                                        to: [event.args.communityName],
                                        hash: event.args.postHash,
                                        get: function(){
                                            var txHash = transactionHash;
                                            $ipfs.get(this.hash).then(function(data){
                                                posts[transactionHash].data = JSON.parse(data);
                                            });
                                        },
                                        data: {
                                            title: null,
                                            link: null,
                                            body: null
                                        },
                                    };

                                    posts[transactionHash].get();
                                    //console.log(post);
                                    deferred.resolve(posts[transactionHash]);
                                    return;
                                }
                            });
                        } else {
                            deferred.reject(err);
                        }
                    });
                }).catch(function(err){
                    console.error(err);
                    deferred.reject(err);
                });
            }).catch(function(err){
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        post: function(from, communityName, postHash) {
            var deferred = $q.defer();
            console.log(from, communityName, postHash);
            Community.post(communityName, postHash, {from: from}, 
            function(err, txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getComments: function(fromBlock, toBlock, parentHash, commentHash){
            var deferred = $q.defer();
            
            //console.log(fromBlock, toBlock, parentHash, commentHash);
            var parentHashHash = web3.sha3(parentHash);
            var commentHashHash = web3.sha3(commentHash);

            if(!parentHash) parentHashHash = null;
            if(!commentHash) commentHashHash = null;
            
            var filter = web3.eth.filter({
                fromBlock: fromBlock,
                toBlock: toBlock,
                address: contractAddress,
                topics: [
                    web3.sha3('Index_event(string,string)'), 
                    parentHashHash,
                    commentHashHash,
                ]
            }).get((error, events) => {
                //console.log(error, events);

                var commentPromises = [];
                events.forEach(log => {
                    //console.log(log);
                    commentPromises.push(this.getComment(log.transactionHash));
                });

                $q.all(commentPromises).then(function(comments){
                    deferred.resolve(comments);
                }).catch(function(err){
                    deferred.reject(err);
                });
            });

            return deferred.promise;
        },
        getComment: function(transactionHash){
            var deferred = $q.defer();
            
            //console.log(transactionHash);
            $web3.getTransaction(transactionHash)
            .then(function(transaction){
                //console.log(transaction);
                $web3.getBlock(transaction.blockNumber).then(function(block){
                    Community.Comment_event(null, {fromBlock: block.number, toBlock: transaction.number})
                    .get(function(err, events){
                        //console.log(err,events);
                        if(!err) {
                            events.forEach(event => {
                                if(posts[event.args.parentHash] && posts[event.args.parentHash].comments)
                                    posts[event.args.parentHash].comments.push(transactionHash);
                                    
                                if(event.transactionHash == transactionHash){
                                    comments[transactionHash] = {
                                        transactionHash: transactionHash,
                                        timestamp: block.timestamp,
                                        score: 100,
                                        poster: transaction.from,
                                        hash: event.args.commentHash,
                                        parentHash: event.args.parentHash,
                                        get: function(){
                                            var txHash = transactionHash;
                                            //console.log(transactionHash);
                                            $ipfs.get(this.hash).then(function(data){
                                                //console.log(data);
                                                comments[transactionHash].data = JSON.parse(data);
                                            });
                                        },
                                        data: {
                                            title: null,
                                            link: null,
                                            body: null
                                        },
                                    };

                                    comments[transactionHash].get();
                                    if(posts[event.args.parentHash] && posts[event.args.parentHash].comments)
                                        posts[event.args.parentHash].comments.push[comments[transactionHash]];
                                        
                                    //console.log(post);
                                    deferred.resolve(comments[transactionHash]);
                                    return;
                                }
                            });
                        } else {
                            deferred.reject(err);
                        }
                    });
                }).catch(function(err){
                    console.error(err);
                    deferred.reject(err);
                });
            }).catch(function(err){
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        comment: function(from, parentHash, postHash) {
            var deferred = $q.defer();
            console.log(from, parentHash, postHash);
            Community.comment(parentHash, postHash, {from: from}, 
            function(err, txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },

    };
    
    return service;
}]);