app.service( 'Profile',['$q','$web3', function ($q, $web3) {
    console.log('Loading Profile Service');

    var service = {
        get: function(publicAddress) {
            var deferred = $q.defer();
            
            var profile = {
                address: publicAddress,
                isLoggedIn: null,
                balance: null
            };

            $web3.getCurrentAccount().then(function(currentAddress){
                profile.isLoggedIn = publicAddress == currentAddress && currentAddress != null;
                if(currentAddress == null)
                    deferred.resolve(profile);
                else
                    return $web3.getBalance(currentAddress);
            }).then(function(balance){
                profile.balance = balance;
                deferred.resolve(profile);
            }).catch(function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        }
    };
    
    return service;
}]);