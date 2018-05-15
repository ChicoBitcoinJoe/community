app.directive('comment', ['RecursionHelper','NameService','Community','$q','$ipfs','$web3','$route',
function(RecursionHelper, NameService, Community, $q, $ipfs, $web3, $route) {
	return {
		restrict: 'E',
		scope: {
            app: '=',
			comment: '=',
            commentDepth: '='
		},
		replace: true,
		templateUrl: 'directives/comment/comment.directive.html',
        compile: function(element) {
            return RecursionHelper.compile(element, function($scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        },
		controller: function($scope){
            console.log($scope.comment, $scope.commentDepth);

            $scope.input = {
                reply: {
                    body: null,
                },
                maxHeight: null
            };

            if($scope.commentDepth > 0){
                Community.getComment($scope.comment.transactionHash).then(function(commentData){
                    console.log(commentData);
                    $scope.comment = commentData;
                })
            }

            $scope.whois = NameService.get;
            $scope.now = function(){
                return parseInt((Date.now() / 1000).toFixed(0));
            };
            
            $scope.goto = function(path){
                $location.path(path);
            };

            var fromBlock = $scope.app.web3.currentBlock.number-4*60*24;
            var toBlock = $scope.app.web3.currentBlock.number;
            Community.getComments(fromBlock, toBlock, $scope.comment.transactionHash, null)
            .then(function(comments){
                console.log(comments);
                $scope.comment.comments = comments;
            }).catch(function(){
                console.error(err);
            });

            function updateIpfsHash(data, pushToGateway) {
                var deferred = $q.defer();
        
                $ipfs.put(data, pushToGateway).then(function(ipfsFile){
                    $scope.comment.file = ipfsFile;
                    return $ipfs.get(ipfsFile.hash);
                }).then(function(data){
                    deferred.resolve(data);
                }).catch(function(err){
                    deferred.reject(err);
                });
        
                return deferred.promise;
            }

            $scope.$watch('input.reply.body', function(){
                updateIpfsHash(JSON.stringify($scope.app.view.comment.data));
            });

            $scope.reply = function(){
                updateIpfsHash(JSON.stringify($scope.input.reply), true)
                .then(function(data){
                    console.log(data);
                    Community.comment(
                        $scope.app.user.address,
                        $scope.comment.transactionHash,
                        $scope.comment.file.hash,
                    ).then(function(txHash){
                        return $web3.getTransactionReceipt(txHash);
                    }).then(function(receipt){
                        console.log(receipt);
                    }).catch(function(err){
                        console.error(err);
                    });
                }).catch(function(err){
                    console.error(err);
                });
            }                

            function calculateElapsedTime(){
                var seconds = $scope.now() - $scope.comment.timestamp;
                var minutes = Math.floor(seconds/60);
                var hours = Math.floor(minutes/60);
                var days = Math.floor(hours/24);
        
                var elapsed = seconds;
                var timeSpan = 'second';
        
                if(days > 0){
                    timeSpan = 'day';
                    elapsed = days;
                } else if(hours > 0){
                    timeSpan = 'hour';
                    elapsed = hours;
                } else if(minutes > 0){
                    timeSpan = 'minute';
                    elapsed = minutes;
                }
                
                var plural = '';
                if(elapsed > 1)
                    plural = 's';
                    
                $scope.timeElapsed = elapsed + ' ' + timeSpan + plural;
            }

            calculateElapsedTime();
        }
	}
}]);