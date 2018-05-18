app.controller('CommunityController', ['$scope','$q','Community', 
function($scope, $q, Community){
    $scope.community = $scope.app.path[1];
    console.log('Loading ' + $scope.community.capitalize() + ' View');
    
    $scope.app.view = {
        ready: false,
        posts: [],
        options: ['top','recent',],
        selectedOption: 'recent',
        showComments: false,
    };

    $scope.app.ready.then(function(){
        var oneDay = 4*60*24;
        var currentBlock = $scope.app.web3.currentBlock.number;
        var oneDayAgo = currentBlock - oneDay;
        
        return Community.getPosts(oneDayAgo, currentBlock, $scope.community);
    }).then(function(dayOldEvents){
        console.log(dayOldEvents);
        $scope.app.view.posts[$scope.app.path[1]] = dayOldEvents;
        
        var oneDay = 4*60*24;
        var currentBlock = $scope.app.web3.currentBlock.number;
        var oneDayAgo = currentBlock - oneDay;
        var threeDaysAgo = currentBlock - oneDay * 3;
        var sevenDaysAgo = currentBlock - oneDay * 7;

        return $q.all([
            Community.getPosts(threeDaysAgo, oneDayAgo-1, $scope.community),
            Community.getPosts(sevenDaysAgo, threeDaysAgo-1, $scope.community)
        ]);
    }).then(function(events){
        //console.log(events);
        events[0].forEach(event => {
            $scope.app.view.posts[$scope.app.path[1]].push(event);
        });

        events[1].forEach(event => {
            $scope.app.view.posts[$scope.app.path[1]].push(event);
        });

        $scope.app.view.ready = true;
        console.log($scope.app);
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
        console.log($scope.app);
    });

}]);