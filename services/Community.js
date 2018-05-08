app.service( 'Community',['$q','$web3', function ($q, $web3) {
    console.log('Loading Community Service');

    var metadata = {"compiler":{"version":"0.4.23+commit.124ca40d"},"language":"Solidity","output":{"abi":[{"constant":false,"inputs":[{"name":"communityName","type":"string"},{"name":"postHash","type":"string"},{"name":"parentHash","type":"string"}],"name":"post","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"communityName","type":"string"},{"indexed":true,"name":"postHash","type":"string"},{"indexed":false,"name":"parentHash","type":"string"}],"name":"Post_event","type":"event"}],"devdoc":{"methods":{}},"userdoc":{"methods":{}}},"settings":{"compilationTarget":{"browser/Community.sol":"Community"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":true,"runs":200},"remappings":[]},"sources":{"browser/Community.sol":{"keccak256":"0xa452801575bb2169de4d61d63abfa6746f55ca7fa8266a715c671ca6b0c153f2","urls":["bzzr://4b08bdbd65bc66f72af7a3cbf37f05e299e48246e50aa497210f8d88b4238716"]}},"version":1};
    
    var Community = web3.eth.contract(metadata.output.abi).at('0x7278b7e2b5c19fbae9ee74aa846460334ee554e5');

    var service = {
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