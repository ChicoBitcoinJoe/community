Community.service( 'IpfsService',['$q','$sce', function ($q,$sce) {
    console.log('Loading IpfsService');
	ipfs.setProvider();
    
	var service = {
		getIpfsData: function (ipfsHash) {
            var deferred = $q.defer();
            console.log(ipfsHash);
            var post = ipfs.catJson(ipfsHash, function(err, ipfsData) {
                if(err || !ipfsData){ 
                    deferred.reject(err);
                } else {
                    deferred.resolve(ipfsData);
                }
    
            });
            //$sce.trustAsResourceUrl(data)
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