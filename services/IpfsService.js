app.service( '$ipfs',['$q', '$http', function ($q, $http) {
    console.log('Loading Ipfs Service');
    
    var promise = $q.defer();
    var ready = promise.promise;

    const node = new Ipfs({ repo: 'ipfs-' + Math.random() })
    node.once('ready', () => {
        //console.log('Node status: ' + (node.isOnline() ? 'online' : 'offline'));
        promise.resolve(node);
        // You can write more code here to use it. Use methods like 
        // node.files.add, node.files.get. See the API docs here:
        // https://github.com/ipfs/interface-ipfs-core
    });
    
    var service = {
        get: function(hash, useFallBackGateway){
            var deferred = $q.defer();
            
            ready.then(function(node){
                if(hash){
                    node.files.cat(hash, function (err, data) {
                        //console.log(err, data.toString);
                        if(!err) {
                            deferred.resolve(data.toString());
                        } else if(useFallBackGateway) {
                            $http({
                                method: 'GET',
                                url: 'https://gateway.ipfs.io/ipfs/' + file.hash
                            }).then(function successCallback(response) {
                                // this callback will be called asynchronously
                                // when the response is available
                                //console.log(response);
                                deferred.resolve(response.data);
                            }, function errorCallback(response) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                                //console.log(response);
                                deferred.reject(response);
                            });
                        } else {
                            deferred.reject(err);
                        }
                    });
                } else {
                    deferred.reject('hash is undefined');
                }
            }).catch(function(err){
                deferred.reject(err);
            });

            return deferred.promise;
        },
        put: function(data, pushToGateway){
            var deferred = $q.defer();

            ready.then(function(node){
                node.files.add(new node.types.Buffer(data), (err, filesAdded) => {
                    if(!err) {
                        filesAdded.forEach((file) => {
                            //console.log(file);
                            if(pushToGateway){
                                console.log('Pushing to gateway: ' + file.hash);
                                $http({
                                    method: 'GET',
                                    url: 'https://gateway.ipfs.io/ipfs/' + file.hash
                                }).then(function successCallback(response) {
                                    // this callback will be called asynchronously
                                    // when the response is available
                                    console.log(response);
                                }, function errorCallback(response) {
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                    console.log(response);
                                });
                            }

                            deferred.resolve(file);
                        });
                    } else {
                        deferred.reject(err);
                    }
                });
            }).catch(function(err){
                conole.error(err);
            });

            return deferred.promise;
        }
    };

    /*
	var service = {
		get: function (ipfsHash) {
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
		put: function (data) {
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
    */

	return service;
}]);
