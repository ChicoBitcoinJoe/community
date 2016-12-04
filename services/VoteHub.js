Community.service('VoteHub', ['$q', function($q) {
    console.log('Loading VoteHub');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var VoteHubAddress = '0xb6a664E612b2F90b2E1627c9EA68B8f6F4d9c883'; //TestNet
    var VoteHubContract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getKeyVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newFundContract","type":"address"}],"name":"changeFundContract","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"},{"name":"amount","type":"uint256"},{"name":"support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"}],"name":"fundDevelopment","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"reclaimVotes","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"community","type":"string"}],"name":"getUserData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getUserVotes","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDetails","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"fundContract","type":"address"}],"payable":false,"type":"constructor"}]);
    var VoteHubInstance = VoteHubContract.at(VoteHubAddress);
    
    var service = {
        
    }
    
    return service;
}]); 