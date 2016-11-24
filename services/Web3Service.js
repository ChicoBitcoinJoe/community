Community.service( 'Web3Service',['$q','$sce', function ($q,$sce) {
    console.log('Loading Web3Service');
    
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    var service = {
		getCurrentAccount: function(){
           return web3.eth.accounts[0];
        },
		getTransactionReceipt: function(txHash){
            var deferred = $q.defer();
            var async_filter = web3.eth.filter('latest', 
            function(err, blockHash) {
                if(!err){
                    var async_reciept = web3.eth.getTransactionReceipt(txHash, 
                    function(err,receipt){
                        if(!err){
                            if(receipt !== null){
                                async_filter.stopWatching();
                                console.log(receipt);
                                deferred.resolve(receipt);
                            } else {
                                console.log("Tx not included in this block. Waiting for reciept.");
                            }
                        } else {
                            async_filter.stopWatching();
                            deferred.reject(err);
                        } 
                    });
                } else {
                    async_filter.stopWatching();
                    deferred.reject(err);
                }
            });
            return deferred.promise;
        }
	};

	return service;
}]);