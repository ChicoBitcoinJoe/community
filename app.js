var app = angular.module('app',['ngRoute','ngMaterial','ngAria','ngAnimate']);

app.run(['$rootScope', function($rootScope) {
    console.log('App is loading.');
}]);

app.controller('AppController', ['$scope','$q','$web3','$location','Profile','PriceFeed',
function($scope, $q, $web3, $location, Profile, PriceFeed) {
    console.log('Loading AppController');

    var ready = $q.defer();

    $scope.web3 = $web3;

    $scope.app = {
        ready: ready.promise,
        web3Connected: null,
        path: parsePath(),
        price: {
            usd: {
                eth: null
            },
            eth: {
                usd: null
            }
        },
        user: {
            isLoggedIn: null,
            address: null,
            balance: null
        },
        block: {
            current: null
        },
        error: null
    };

    $web3.assertNetworkId($web3.networks.kovan)
    .then(function(currentBlock){
        $scope.app.web3Connected = true;
        $scope.app.block.current = currentBlock;
        return $q.all([
            $web3.getCurrentAccount(),
            PriceFeed.get('usd','eth'),
            PriceFeed.get('eth','usd'),
        ]);
    }).then(function(promises){
        var currentAddress = promises[0];
        var usdPerEth = promises[1];
        var ethPerUsd = promises[2];

        $scope.app.price['usd']['eth'] = usdPerEth;
        $scope.app.price['eth']['usd'] = ethPerUsd;

        return Profile.get(currentAddress);
    }).then(function(profile){
        $scope.app.user = profile;
        console.log($scope.app);
        ready.resolve();
    }).catch(function(err){
        $scope.app.web3Connected = false;

        console.error(err);
        console.log($scope.app);
        $scope.app.error = err;
        ready.reject(err);
    });

    function getNow(){
        return parseInt((Date.now() / 1000).toFixed(0));
    }
    
    function parsePath(){
        var path = $location.path();
        return path.split('/').slice(1,path.length);
    }

    $scope.$on('$routeChangeStart', function($event, next, current) {
        $scope.app.path = parsePath();
    });

    web3.eth.filter('latest', function(err, blockHash){
        //console.log(err, blockHash);
        console.log('New block found. Updating current block...');
        $web3.getBlock(blockHash).then(function(currentBlock){
            $scope.app.block.current = currentBlock;
        });
    });

}]);