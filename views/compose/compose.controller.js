app.controller('ComposeController', ['$scope','$ipfs','$sce','$web3','$location','Community',
function($scope, $ipfs, $sce, $web3, $location, Community){
    console.log('Loading Compose View');
    
    $scope.app.view = {
        ready: false,
        preview: null,
        post: {
            score: 100,
            to: [$scope.app.path[1]],
            poster: null,
            data: {
                title: null,
                link: null,
                body: null,
            },
            file: {
                hash: null
            }
        },
        postButtonText: 'post',
        waiting: false,
        forwardHash: null,
        error: null,
    };

    $scope.app.ready.then(function(){
        $scope.app.view.post.poster = $scope.app.user.address;
        $scope.app.view.ready = true;
        console.log($scope.app);
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
        console.log($scope.app);
    });

    function updateIpfsHash(data, pushToGateway) {
        $ipfs.put(data, pushToGateway).then(function(ipfsFile){
            $scope.app.view.post.file = ipfsFile;
            return $ipfs.get(ipfsFile.hash);
        }).then(function(data){
            //console.log(JSON.parse(data));
        }).catch(function(err){
            console.error(err);
        });
    }

    $scope.$watch('app.view.post.data.title', function(){
        updateIpfsHash(JSON.stringify($scope.app.view.post.data));
    })

    $scope.$watch('app.view.post.data.link', function(){
        updateIpfsHash(JSON.stringify($scope.app.view.post.data));
    })

    $scope.$watch('app.view.post.data.body', function(){
        try {
            if($scope.app.view.post.data.body)
                $scope.app.view.post.preview = $sce.trustAsHtml(marked($scope.app.view.post.data.body));
        } catch(err){
            console.error(err);
        }

        updateIpfsHash(JSON.stringify($scope.app.view.post.data));
    });

    $scope.post = function(){
        updateIpfsHash(JSON.stringify($scope.app.view.post.data), true);
        $scope.app.view.postButtonText = '..'

        $scope.app.view.waiting = true;
        
        $scope.waitingInterval = setInterval(function(){
            if($scope.app.view.postButtonText == '.')
                $scope.app.view.postButtonText = '..';
            else if($scope.app.view.postButtonText == '..')
                $scope.app.view.postButtonText = '...';
            else if($scope.app.view.postButtonText == '..')
                $scope.app.view.postButtonText = '...';
            else if($scope.app.view.postButtonText == '...')
                $scope.app.view.postButtonText = '....';
            else
                $scope.app.view.postButtonText = '.';

        }, 1000);

        Community.post(
            $scope.app.user.address,
            $scope.app.path[1],
            $scope.app.view.post.file.hash
        ).then(function(txHash){
            $scope.app.view.forwardHash = txHash;
            return $web3.getTransactionReceipt(txHash);
        }).then(function(receipt){
            console.log(receipt);
            clearInterval($scope.waitingInterval);
            $location.path('c/' + $scope.app.path[1] + '/' + $scope.app.view.forwardHash);
        }).catch(function(err){
            $scope.app.view.waiting = false;
            $scope.app.view.postButtonText = 'post';
            $scope.app.view.error = true;
            console.error(err);
        });
    }

    $scope.$on('$routeChangeStart', function($event, next, current) {
        if($scope.waitingInterval){
            clearInterval($scope.waitingInterval);
            $scope.waitingInterval = null;
        }
    });
}]);