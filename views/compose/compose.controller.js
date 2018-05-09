app.controller('ComposeController', ['$scope','IpfsService','$sce','$web3','Community',
function($scope, $ipfs, $sce, $web3, Community){
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
        }
    };

    $scope.app.ready.then(function(){
        $scope.app.view.post.poster = $scope.app.user.address;
        $scope.app.view.ready = true;
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
    });

    function updateIpfsHash(data) {
        $ipfs.put(data).then(function(ipfsFile){
            $scope.app.view.post.file = ipfsFile;
            return $ipfs.get(ipfsFile.hash);
        }).then(function(data){
            console.log(JSON.parse(data));
        }).catch(function(err){
            console.error(err);
        });
    }

    $scope.$watch('app.view.post.data.title', function(){
        updateIpfsHash(JSON.stringify($scope.app.view.post));
    })

    $scope.$watch('app.view.post.data.link', function(){
        updateIpfsHash(JSON.stringify($scope.app.view.post));
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
        Community.post(
            $scope.app.user.address,
            $scope.app.path[1],
            $scope.app.view.post.file.hash,
            ''
        ).then(function(txHash){
            return $web3.getTransactionReceipt(txHash);
        }).then(function(receipt){
            console.log(receipt);
        }).catch(function(err){
            console.error(err);
        });
    }
}]);