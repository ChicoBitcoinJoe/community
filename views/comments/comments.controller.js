app.controller('CommentsController', ['$scope','$ipfs','$web3','$q','$route','$mdMedia','Community',
function($scope, $ipfs, $web3, $q, $route, $mdMedia, Community){
    console.log('Loading Comments View');
    
    if($mdMedia('xs'))
        $scope.maxHeight = '50%';
    else
        $scope.maxHeight = 'none';


    $scope.app.view = {
        ready: false,
        comments: null,
        post: null,
        comment: {
            file: null,
            data: {
                body: null
            }
        },
        timeElapsed: null,
        preview: '<h4>loading...</h4>',
    };

    $scope.app.ready.then(function(){
        return Community.getPost($scope.app.path[2]);
    }).then(function(post){
        //console.log(post);
        $scope.app.view.post = post;
        var fromBlock = $scope.app.web3.currentBlock.number-4*60*24;
        var toBlock = $scope.app.web3.currentBlock.number;
        return Community.getComments(fromBlock, toBlock, post.transactionHash, null);
    }).then(function(comments){
        console.log(comments);
        $scope.app.view.comments = comments;
        calculateElapsedTime();
        $scope.app.view.ready = true;
        console.log($scope.app);
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
    });

    $scope.now = function(){
        return parseInt((Date.now() / 1000).toFixed(0));
    };
    
    $scope.goto = function(path){
        $location.path(path);
    };

    function updateIpfsHash(data, pushToGateway) {
        var deferred = $q.defer();

        $ipfs.put(data, pushToGateway).then(function(ipfsFile){
            $scope.app.view.comment.file = ipfsFile;
            return $ipfs.get(ipfsFile.hash);
        }).then(function(data){
            deferred.resolve(data);
        }).catch(function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    }
    
    $scope.$watch('app.view.post.data.body', function(){
        try {
            if($scope.app.view.post.data.body)
                $scope.app.view.post.preview = marked($scope.app.view.post.data.body);
        } catch(err){
            //console.error(err);
        }
    });

    $scope.$watch('app.view.comment.data.body', function(){
        try {
            if($scope.app.view.comment.data.body)
                $scope.app.view.preview = marked($scope.app.view.comment.data.body);
        } catch(err){
            //console.error(err);
        }

        updateIpfsHash(JSON.stringify($scope.app.view.comment.data));
    });

    $scope.comment = function(){
        updateIpfsHash(JSON.stringify($scope.app.view.comment.data), true)
        .then(function(data){
            console.log(data);
            Community.comment(
                $scope.app.user.address,
                $scope.app.path[2],
                $scope.app.view.comment.file.hash,
            ).then(function(txHash){
                return $web3.getTransactionReceipt(txHash);
            }).then(function(receipt){
                console.log(receipt);
                $route.reload();
            }).catch(function(err){
                console.error(err);
            });
        }).catch(function(err){
            console.error(err);
        });
    }

    function calculateElapsedTime(){
        var seconds = $scope.now() - $scope.app.view.post.timestamp;
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
            
        $scope.app.view.timeElapsed = elapsed + ' ' + timeSpan + plural;
    }

}]);