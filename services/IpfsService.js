Community.service( 'IpfsService',['$q', function ($q) {
    console.log('Loading IpfsService');
	ipfs.setProvider();
    
	var service = {
		getIpfsData: function (ipfsHash) {
            var deferred = $q.defer();
            
            var local = localStorage.getItem(ipfsHash);
            if(!local){
                //console.log("fetching data from ipfs for", ipfsHash);
                var post = ipfs.catJson(ipfsHash, function(err, ipfsData) {
                    if(err || !ipfsData){
                        deferred.reject(err);
                    } else {
                        localStorage.setItem(ipfsHash,JSON.stringify(ipfsData));
                        deferred.resolve(ipfsData);
                    }
                });
            } else {
                //console.log('Found ipfs data in localStorage');
                deferred.resolve(JSON.parse(local));
            }
            
            return deferred.promise;
		},
		getIpfsHash: function (data) {
            var deferred = $q.defer();
            
            //console.log("Calculating ipfs hash for", data);
			var promise = ipfs.addJson(data, function(err, hash){
                if(err || !hash){
                    deferred.reject(err);
                } else {
                    //console.log(hash);
                    deferred.resolve(hash);
                }
            });
            return deferred.promise;
		}
	};

	return service;
}]);
