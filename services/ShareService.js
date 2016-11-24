Community.service('ShareService', ['$q','Web3Service', function ($q,Web3Service) {
    console.log('Loading Share Service');
    
    var ShareAddress = '0xe075925cea303a64d66c81f1f4388a6d16850a66'; //TestNet
    var ShareContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTotalShards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"shardName","type":"string"}],"name":"CreateShard_event","type":"event"}]);
    var ShareInstance = ShareContract.at(ShareAddress);
    
    var service = {
        createShard: function(shardName){
            var deferred = $q.defer();
            ShareInstance.createShard(shardName, {from:Web3Service.getCurrentAccount(),gas: 4700000}, 
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
        getTotalShards: function(){
            var deferred = $q.defer();
            ShareInstance.getTotalShards(
            function(err,totalShards){
                if(!err){
                    console.log(totalShards);
                    deferred.resolve(totalShards);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getShardAddress: function(shardName){
            var deferred = $q.defer();

            var localAddress = localStorage.getItem(shardName+'_shard_address');
            if(!localAddress){
                ShareInstance.getShardAddress(shardName, function(error,shardAddress){
                    if(!error){
                        if(shardAddress === '0x0000000000000000000000000000000000000000' || shardAddress === '0x'){
                            deferred.resolve(false);
                        } else {
                            //console.log("saved shard " + shardName + " at address: " + shardAddress);
                            localStorage.setItem(shardName+'_shard_address',shardAddress)
                            deferred.resolve(shardAddress);    
                        }
                    } else {
                        deferred.reject(error);
                    }
                });
            } else {
                deferred.resolve(localAddress);
            }

            return deferred.promise;
        },
        getShardName: function(){
            //To Do When Needed
        }
    }
    
    return service;
}]); 