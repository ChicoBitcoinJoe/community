Community.service( 'Web3Service',['$q','$window', function ($q,$window) {
    console.log('Loading Web3Service');
    
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    var currentAccount = web3.eth.accounts[0];
    setInterval(function(){
        //console.log(currentAccount,web3.eth.accounts[0]);
        if(currentAccount !== 'undefined'){
            if(currentAccount !== web3.eth.accounts[0])
                $window.location.reload();
        }
    },100);
    
    var service = {
		getCurrentAccount: function(){
           return currentAccount;
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
                                //console.log(receipt);
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
        },
        getCurrentBlock: function(){
            var deferred = $q.defer();
            var async_getCurrentBlock = web3.eth.getBlockNumber(
            function(err,currentBlock){
                if(!err){
                    deferred.resolve(currentBlock);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        }
	};

	return service;
}]);