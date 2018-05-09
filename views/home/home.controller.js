app.controller('HomeController', ['$scope',
function($scope){
    console.log('Loading Home View');
    
    $scope.app.view = {
        ready: false,
    };

    $scope.app.ready.then(function(){
        $scope.app.view.ready = true;
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
    });

}]);