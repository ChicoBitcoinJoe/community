app.service( 'Profile',['$q','$web3', function ($q, $web3) {
    console.log('Loading Profile Service');

    var service = {
        get: function(publicAddress) {
            var deferred = $q.defer();
            
            $web3.getCurrentAccount().then(function(currentAddress){
                var profile = {
                    address: publicAddress,
                    isLoggedIn: publicAddress == currentAddress && currentAddress != null,
                    balance: null,
                    communities: ['community','bitcoin','ethereum','monero','funny'],
                    multis: [],
                    favorite: function(community){
                        //console.log(this);
                        if(this.communities.indexOf(community) == -1){
                            this.communities.push(community);
                            this.saveLocally();
                        }
                    },
                    unfavorite: function(community){
                        if(this.communities.indexOf(community) > -1){
                            //console.log(this);
                            var index = this.communities.indexOf(community);
                            if (index > -1)
                                this.communities.splice(index, 1);
                            this.saveLocally();
                        }
                    },
                    saveLocally: function(){
                        localStorage.setItem(this.address, JSON.stringify({
                            communities: this.communities,
                            multis: this.multis,
                        }));
                    }
                };

                var localProfile = JSON.parse(localStorage.getItem(currentAddress));
                if(localProfile){
                    profile.communities = localProfile.communities;
                    profile.multis = localProfile.multis;
                } else {
                    profile.profile = {
                        communities: [],
                        multis: {},
                    }
                }
        
                if(currentAddress == null)
                    deferred.resolve(profile);
                else {
                    $web3.getBalance(currentAddress)
                    .then(function(balance){
                        profile.balance = balance;
                        deferred.resolve(profile);
                    }).catch(function(err){
                        deferred.reject(err);
                    });
                }
            }).catch(function(err){
                deferred.reject(err);
            });
            
            return deferred.promise;
        }
    };
    
    return service;
}]);