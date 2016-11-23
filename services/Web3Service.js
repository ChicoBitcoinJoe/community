Community.service( 'Web3Service',['$q','$sce', function ($q,$sce) {
    console.log('Loading Web3Service');
	var currentAccount = null;
    
    var discoverWeb3 = function(){
        // Use Mist/MetaMask's provider
        console.log("Discovered web3");
        web3 = new Web3(web3.currentProvider);
        currentAccount = web3.eth.accounts[0];
        localStorage.setItem('ProfileDB.lastUsedAccount',currentAccount);
    };
    
    if (typeof web3 !== 'undefined') {
        discoverWeb3();
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        var local = localStorage.getItem('ProfileDB.lastUsedAccount');
        if(local)
            currentAccount = local;
    }
    
    if(!currentAccount){
        var interval = setInterval(function(){
            if (typeof web3 !== 'undefined') {
                discoverWeb3();
                clearInterval(interval);
            } 
        }, 100);
    }

	var service = {
		getCurrentAccount: function(){
           return currentAccount;
        },
		getTransactionReceipt: function(txHash){
            var deferred = $q.defer();
            var async_filter = web3.eth.filter('latest', function(err, blockHash) {
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
                            deferred.reject(err);
                        } 
                    });
                } else {
                    deferred.reject(err);
                }
            });
            return deferred.promise;
        }
	};

	return service;
}]);