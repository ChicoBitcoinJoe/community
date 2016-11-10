Community.service( 'IpfsService',['$q','$sce', function ($q,$sce) {
    console.log('Loading IpfsService');
	ipfs.setProvider();
    
	var service = {
		getIpfsData: function (ipfsHash) {
            var deferred = $q.defer();
            var local = localStorage.getItem(ipfsHash);
            if(local){
                console.log("retrieving locally");
                deferred.resolve(JSON.parse(local));
            } else {
                console.log("fetching from ipfs");
                var post = ipfs.catJson(ipfsHash, function(err, ipfsData) {
                    if(err || !ipfsData){
                        deferred.reject(err);
                    } else {
                        //console.log(ipfsData);
                        console.log("storing locally");
                        localStorage.setItem(ipfsHash,JSON.stringify(ipfsData));
                        deferred.resolve(ipfsData);
                    }
                });    
            }
            
            return deferred.promise;
		},
		getIpfsHash: function (data) {
            var deferred = $q.defer();
			var promise = ipfs.addJson(data, function(err, hash){
                if(!err){
                    deferred.resolve(hash);
                } else {
                    deferred.reject(err);
                }
            });
            return deferred.promise;
		}
	};

	return service;
}]);