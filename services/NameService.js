app.service( 'NameService',['$q','$web3', function ($q, $web3) {
    console.log('Loading Name Service');

    var names = {
        //address: 'name'
    };

    var service = {
        register: function(address, name) {
            localStorage.setItem(address + '.name', name);
            names[address] = name;
        },
        get: function(address) {
            if(!names[address]){
                var name = localStorage.getItem(address+'.name');
                if(name){
                    names[address] = name;
                    return name;
                }

                return address;
            }
                
            return names[address];
        }
    };
    
    return service;
}]);