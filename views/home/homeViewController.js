app.controller('HomeViewController', ['$scope',
function($scope){
    console.log('Loading Home View');
    
    $scope.app.view = {
        ready: false,
        options: ['top','recent',],
        selectedOption: 'top',
    };

    $scope.app.ready.then(function(){
        $scope.app.view.ready = true;
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
    });

    $scope.posts = {
        0: {
            score: 100,
            to: ['Bitcoin', 'Ethereum'],
            poster: "ChicoBitcoinJoe",
            data: {
                title: "Bitcoin's Voice is Free on the Ethereum Network",
            }
        },
        1: {
            score: 95,
            to: ['Monero'],
            poster: "SilentGoose",
            data: {
                title: "What Can Public Blockchains Learn From Monero?",
            }
        },
        2: {
            score: 80,
            to: ['Me'],
            poster: "Tiltegore",
            data: {
                title: "This is a really long title to simulate a really long title. It should overlap at least once and hopefully twice. Three times would be quite the gravy if you know what I mean!",
            }
        },
        
    }

}]);