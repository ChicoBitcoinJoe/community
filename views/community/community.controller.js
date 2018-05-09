app.controller('CommunityController', ['$scope', 'Community', 
function($scope, Community){
    console.log('Loading Community View');
    
    $scope.app.view = {
        ready: false,
        options: ['top','recent',],
        selectedOption: 'top',
    };

    $scope.app.ready.then(function(){
        $scope.app.view.ready = true;
        
        return Community.events(
            $scope.app.path[1],
            $scope.app.web3.currentBlock.number-4*60*24*7,
            'latest',
        );
    }).then(function(events){
        console.log(events);
    }).catch(function(err){
        $scope.app.view.ready = true;
        console.error(err);
    });

    $scope.posts = {
        0: {
            score: 100,
            to: ['Bitcoin', 'Ethereum'],
            poster: '0x5e571fbcea726f15347f693213b3245c5b226ce1',
            data: {
                title: "Bitcoin's Voice is Free on the Ethereum Network",
                link: null,
                body: null,
            }
        },
        1: {
            score: 95,
            to: ['Monero'],
            poster: '0x5e571fbcea726f15347f693213b3245c5b226ce1',
            data: {
                title: "What Can Public Blockchains Learn From Monero?",
            }
        },
        2: {
            score: 80,
            to: ['Me'],
            poster: '0x5e571fbcea726f15347f693213b3245c5b226ce1',
            data: {
                title: "This is a really long title to simulate a really long title. It should overlap at least once and hopefully twice. Three times would be quite the gravy if you know what I mean!",
            }
        },
        
    }

}]);