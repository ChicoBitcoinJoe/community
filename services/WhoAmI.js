app.service( 'PriceFeed',['$q','$web3', function ($q, $web3) {
    console.log('Loading Profile Service');

    var metadata = null;
    
    var PriceFeed = web3.eth.contract(metadata.output.abi).at(null);
    
    return function(address) {
        var deferred = $q.defer();
        
        if(address)
            deferred.resolve(address.slice(0,6));
        else
            deferred.reject(address);
        
        return deferred.promise;
    };
    
}]);