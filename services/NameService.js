Community.service('NameService', ['$q','Web3Service',
function ($q,Web3Service) {
    console.log('Loading Name Service');
    
    var NameContractAddress = '0x6CcDf3643fE0E664E7f120Aebe6582C0fd8AFdb6';//TestNet
    var NameContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}]);
    var NameInstance = NameContract.at(NameContractAddress);
    
    var uniqueLength = 4;
    
    var service = {
        getName: function(account){
            var deferred = $q.defer();
            
            console.log('here');
            NameInstance.get(account,
            function(err, name){
                if(!err){
                    console.log(name);
                    var unique = account.slice(2,2+uniqueLength);
                    if(name){
                        deferred.resolve(name+'#'+unique);
                    } else {
                        deferred.resolve('Anonymous#'+unique);
                    }
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        setName: function(newName){
            var deferred = $q.defer();
            
            NameInstance.set(newName, {from:Web3Service.getCurrentAccount(),gas: 4700000}, 
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
        }
    }
    
    return service;
}]);