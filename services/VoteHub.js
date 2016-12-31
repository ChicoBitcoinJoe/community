Community.service('VoteHub', ['$q','Web3Service', 
function($q,Web3Service) {
    console.log('Loading VoteHub');
    
    var VoteHubAddress = '0x0E8263Bc20c82f2e3f6C3eD04eF0d0085e4aD561'; //TestNet
    var VoteHubContract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"community","type":"string"}],"name":"getCommunityData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getKeyVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newFundContract","type":"address"}],"name":"changeFundContract","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"},{"name":"amount","type":"uint256"},{"name":"support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"}],"name":"fundDevelopment","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getVoteHubDetails","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"community","type":"string"}],"name":"getUserData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"reclaimTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getUserVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"fundContract","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"funder","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"FundDevelopment_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"voter","type":"address"},{"indexed":false,"name":"community","type":"string"},{"indexed":false,"name":"key","type":"string"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"support","type":"bool"}],"name":"Vote_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"voter","type":"address"},{"indexed":false,"name":"community","type":"string"},{"indexed":false,"name":"key","type":"string"},{"indexed":false,"name":"upvotes","type":"uint256"},{"indexed":false,"name":"downvotes","type":"uint256"}],"name":"ReclaimTokens_event","type":"event"}]);
    var VoteHubInstance = VoteHubContract.at(VoteHubAddress);
    
    var service = {
        fundDevelopment: function(community, etherAmount){
            var deferred = $q.defer();
            
            VoteHubInstance.fundDevelopment(community, {from:Web3Service.getCurrentAccount(),value:web3.toWei(etherAmount,'ether')}, 
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
            
            VoteHubInstance.vote(community, txHash, tokenAmount, support, {from:Web3Service.getCurrentAccount()}, 
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
        getKeyVotes: function(community, key){
            var deferred = $q.defer();
            
            VoteHubInstance.getKeyVotes(community, key, 
            function(error, voteData){
                if(!error){
                    deferred.resolve(voteData);
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;
        },
        getUserVotes: function(account, community, key){
            var deferred = $q.defer();
            
            VoteHubInstance.getUserVotes(account, community, key, 
            function(error, voteData){
                if(!error){
                    deferred.resolve(voteData);
                } else{
                    deferred.reject(error);
                }
            });
            
            return deferred.promise;
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