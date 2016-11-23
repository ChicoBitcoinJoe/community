Community.service( 'IpfsService',['$q','$sce', function ($q,$sce) {
    console.log('Loading IpfsService');
	ipfs.setProvider();
    
	var service = {
		getIpfsData: function (ipfsHash) {
            var deferred = $q.defer();
            
            console.log("fetching data from ipfs for",ipfsHash);
            var post = ipfs.catJson(ipfsHash, function(err, ipfsData) {
                if(err || !ipfsData){
                    deferred.reject(err);
                } else {
                    deferred.resolve(ipfsData);
                }
            });
            
            return deferred.promise;
		},
		getIpfsHash: function (data) {
            var deferred = $q.defer();
            
            console.log("Calculating ipfs hash for",data);
			var promise = ipfs.addJson(data, function(err, hash){
                if(err || !hash){
                    deferred.reject(err);
                } else {
                    console.log(hash);
                    deferred.resolve(hash);
                }
            });
            return deferred.promise;
		}
	};

	return service;
}]);