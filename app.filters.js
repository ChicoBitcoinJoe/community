app.filter('fromWei', [function() {
    return function(value, convertTo) {
        if(value == null)
            return 0;
        
        return web3.fromWei(value,convertTo).toNumber();
    };
}]);

app.filter('decimals', [function() {
    return function(value,decimals) {
        if(value == null)
            return 0;
        
        return value.toFixed(decimals);
    };
}]);

app.filter('reverse', function() {
    return function(items) {
        if(items == null)
            return [];
        
        return items.slice().reverse();
    };
});