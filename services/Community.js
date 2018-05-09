app.service( 'Community',['$q','$web3', function ($q, $web3) {
    console.log('Loading Community Service');

    var metadata = {"compiler":{"version":"0.4.23+commit.124ca40d"},"language":"Solidity","output":{"abi":[{"constant":false,"inputs":[{"name":"communityName","type":"string"},{"name":"postHash","type":"string"},{"name":"parentHash","type":"string"}],"name":"post","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_communityName","type":"string"},{"indexed":true,"name":"_postHash","type":"string"},{"indexed":true,"name":"_parentHash","type":"string"},{"indexed":false,"name":"communityName","type":"string"},{"indexed":false,"name":"postHash","type":"string"},{"indexed":false,"name":"parentHash","type":"string"}],"name":"Post_event","type":"event"}],"devdoc":{"methods":{}},"userdoc":{"methods":{}}},"settings":{"compilationTarget":{"browser/Community.sol":"Community"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":true,"runs":200},"remappings":[]},"sources":{"browser/Community.sol":{"keccak256":"0x654c581593f4524435b7cc55977861dd3147358901e8f7cccdc21a192f911e0d","urls":["bzzr://dbc2dbcd55f938c2fe924e3080c26c7055127d3a12d33841107dc2b4e3f3af33"]},"browser/LibList.sol":{"keccak256":"0x7ad08da5b76be5edd37641e3aa490919fe170ae3bb486705cce21f174a4f1815","urls":["bzzr://c8bca85e62038173752f6677ed717afb3dc72abd2e3e519748e2ff45b09d4a5e"]}},"version":1};
    
    var contractAddress = '0x1214c8e88c83b89ec18fc76fa9a52c7fff1471e5';

    var Community = web3.eth.contract(metadata.output.abi).at(contractAddress);

    var service = {
        events: function(communityName, fromBlock, toBlock){
            var deferred = $q.defer();
            
            var filter = web3.eth.filter({
                fromBlock: fromBlock,
                toBlock: toBlock,
                address: contractAddress,
                topics: [web3.sha3('Post_event(string,string,string,string,string,string)'), web3.sha3(communityName)]
            });
              
            filter.get((error, logs) => {
                console.log(error, logs);
                var eventPromises = [];
                logs.forEach(log => {
                    eventPromises.push($web3.getTransactionReceipt(log.transactionHash));
                });
                
                $q.all(eventPromises).then(function(events){
                    console.log(events);
                    deferred.resolve(events);
                }).catch(function(err){
                    deferred.reject(err);
                });
            });

            /*
            var communityEvents = Community.Post_event({communityName:communityName},{
                fromBlock: fromBlock, 
                toBlock: toBlock, 
                //topics: [web3.sha3('Post_event(string,string,string)'), web3.sha3(communityName)]
            });

            communityEvents.get(function(err, events){
                //console.log(err,events);
                if(!err)
                    deferred.resolve(events);
                else
                    deferred.reject(err);
            });
            */

            return deferred.promise;
        },
        post: function(from, communityName, postHash, parentHash) {
            var deferred = $q.defer();
            
            Community.post(communityName, postHash, parentHash, {from: from}, 
            function(err, txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        }
    };
    
    return service;
}]);