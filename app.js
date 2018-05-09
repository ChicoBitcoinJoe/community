var app = angular.module('app',['ngRoute','ngMaterial','ngAria','ngAnimate']);

app.run(['$rootScope', function($rootScope) {
    console.log('App is loading.');
}]);

app.controller('AppController', ['$scope','$q','$web3','$location','Profile','PriceFeed','NameService','$mdSidenav',
function($scope, $q, $web3, $location, Profile, PriceFeed, Names, $mdSidenav) {
    console.log('Loading AppController');

    var ready = $q.defer();

    $scope.web3 = $web3;
    $scope.whois = Names.get;

    $scope.app = {
        ready: ready.promise,
        web3: {
            network: $web3.networks.kovan,
            connected: null,
            currentBlock: null,
        },
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
        search: null,
        error: null
    };

    $web3.assertNetworkId($scope.app.web3.network)
    .then(function(currentBlock){
        $scope.app.web3.connected = true;
        $scope.app.web3.currentBlock = currentBlock;

        return $q.all([
            $web3.getCurrentAccount(),
            PriceFeed.get('usd','eth'),
            PriceFeed.get('eth','usd'),
        ]);
    }).then(function(promises){
        var currentAddress = promises[0];
        var usdPerEth = promises[1];
        var ethPerUsd = promises[2];

        Names.register(currentAddress, 'Me');

        $scope.app.price['usd']['eth'] = usdPerEth;
        $scope.app.price['eth']['usd'] = ethPerUsd;

        return Profile.get(currentAddress);
    }).then(function(profile){
        $scope.app.user = profile;
        $scope.app.user['communities'] = ['bitcoin','ethereum','monero'];

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

    $scope.toggleSidenav = function(id){
        $mdSidenav(id).toggle()
        .then(function () {
            console.log('Toggled: ' + id);
        });
    }

    $scope.goto = function(path){
        $location.path(path);
        $scope.app.search = null;
    }
    
    $scope.search = function(search){
        if(search)
            $scope.goto('c/'+search.toLowerCase());

        $scope.app.search = null;
    }

}]);