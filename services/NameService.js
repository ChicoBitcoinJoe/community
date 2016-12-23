Community.service('NameService', ['$q','Web3Service',
function ($q,Web3Service) {
    console.log('Loading Name Service');
    
    var NameContractAddress = '0x0208482b5E9467841a0350CA932cF31475CA8A06';//TestNet
    var NameContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}]);
    var NameInstance = NameContract.at(NameContractAddress);
    
    var uniqueLength = 4;
    
    var name = {};
    
    var service = {
        getName: function(account){
            var deferred = $q.defer();
            
            if(name[account]){
                console.log("Found name in memory",name[account],account);
                deferred.resolve(name[account]);
            } else {
                NameInstance.get(account,
                function(err, name){
                    if(!err){
                        name[account] = name;
                        deferred.resolve(name);
                    } else {
                        deferred.resolve('anonymous');
                    }
                });
            }
            
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