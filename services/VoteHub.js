Community.service('VoteHub', ['$q','Web3Service', 
function($q,Web3Service) {
    console.log('Loading VoteHub');
    
    var VoteHubAddress = '0x743a2Dcf51309781A8af3a49D4A5B5F3FC7686A6'; //TestNet
    var VoteHubContract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getKeyVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newFundContract","type":"address"}],"name":"changeFundContract","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"},{"name":"amount","type":"uint256"},{"name":"support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"}],"name":"fundDevelopment","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"reclaimVotes","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"community","type":"string"}],"name":"getUserData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getUserVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDetails","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"fundContract","type":"address"}],"payable":false,"type":"constructor"}]);
    var VoteHubInstance = VoteHubContract.at(VoteHubAddress);
    
    var service = {
        fundDevelopment: function(community, etherAmount){
            var deferred = $q.defer();
            
            VoteHubInstance.fundDevelopment(community, {from:Web3Service.getCurrentAccount(),value:web3.toWei(etherAmount,'ether'),gas: 4700000}, 
            function(error, txHash){
                if(!error){
                    Web3Service.getTransactionReceipt(txHash)
                    .then(function(receipt){
                        deferred.resolve(receipt);
                    }, function(err){
                        deferred.reject(err);
                    });
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;
        },
        vote: function(community, txHash, tokenAmount, support){
            var deferred = $q.defer();
            
            VoteHubInstance.vote(community, txHash, amount, support, {from:Web3Service.getCurrentAccount(),gas: 4700000}, 
            function(error, txHash){
                if(!error){
                    Web3Service.getTransactionReceipt(txHash)
                    .then(function(receipt){
                        deferred.resolve(receipt);
                    }, function(err){
                        deferred.reject(err);
                    });
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;
        },
        reclaimVotes: function(community, txHash){
            
        },
        getKeyUpvotes: function(community, txHash){
            
        },
        getUserVotes: function(account, community, txHash){
            
        },
        getUserData: function(account, community){
            var deferred = $q.defer();
            
            VoteHubInstance.getUserData(account, community, 
            function(error, data){
                if(!error){
                    deferred.resolve(data);
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;    
        },
        getVoteHubDetails: function(){
        
        }
    }
    
    return service;
}]); 