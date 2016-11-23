Community.service('VoteHub', ['$q', function($q) {
    console.log('Loading LinkDB');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var VoteHubAddress = '0xb6a664E612b2F90b2E1627c9EA68B8f6F4d9c883'; //TestNet
    var VoteHubContract = web3.eth.contract(
        [{"constant":false,"inputs":[],"name":"confirmNewMultisig2","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getUserData","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newFundContract","type":"address"}],"name":"changeFundContractProposal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"getCommunityVotes","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newMultisig2","type":"address"}],"name":"changeMultiSig2","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newMultisig1","type":"address"}],"name":"changeMultiSig1","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"},{"name":"amount","type":"uint256"},{"name":"support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"}],"name":"fundDevelopment","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"confirmNewMultisig1","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"contractToConfirm","type":"address"}],"name":"confirmNewContract","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"community","type":"string"},{"name":"key","type":"string"}],"name":"reclaimVotes","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"accountCompromised","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"fundContract","type":"address"}],"type":"constructor"}]);
    var VoteHubInstance = VoteHubContract.at(VoteHubAddress);
    
    var service = {
        
    }
    
    return service;
}]); 