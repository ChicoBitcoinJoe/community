app.controller('MultiController', ['$scope','$web3','$q','Community', 
function($scope, $web3, $q, Community){
    console.log('Loading Multi View');
    
    $scope.app.view = {
        ready: false,
        posts: [],
        options: ['top','recent',],
        selectedOption: 'recent',
    };

    $scope.app.ready.then(function(){
        if($scope.app.path[1] == 'all')
            $scope.multis = $scope.app.user.communities;
        else
            $scope.multis = $scope.app.path[1].split('+');

        //console.log($scope.multis);

        var oneDay = 4*60*24*2;
        var currentBlock = $scope.app.web3.currentBlock.number;
        var oneDayAgo = currentBlock - oneDay;
        var postPromises = [];
        $scope.multis.forEach(community => {
            postPromises.push(Community.getPosts(oneDayAgo, currentBlock, community));
        });

        $q.all(postPromises).then(function(promises){
            for( var i = 0; i < $scope.multis.length; i++){
                promises[i].forEach(post => {
                    //console.log(post);
                    $scope.app.view.posts.push(post);
                });
            }
            //console.log($scope.app.view.posts);
        }).catch(function(err){
            console.error(err);
        });

        $scope.app.view.ready = true;
        console.log($scope.app);
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
        console.log($scope.app);
    });

}]);