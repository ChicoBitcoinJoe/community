app.service( 'PriceFeed',['$q','$web3', function ($q, $web3) {
    console.log('Loading Profile Service');

    var metadata = {"compiler":{"version":"0.4.23+commit.124ca40d"},"language":"Solidity","output":{"abi":[{"constant":true,"inputs":[],"name":"getUSDperETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getETHperUSD","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],"devdoc":{"methods":{}},"userdoc":{"methods":{}}},"settings":{"compilationTarget":{"browser/PaymentScheduler.sol":"EtherPriceFeed"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":true,"runs":200},"remappings":[]},"sources":{"browser/DSValue.sol":{"keccak256":"0x8a81aa3abde0535aaefc2b816b8fade8e778a5bc085255a21fe4a117d022b32a","urls":["bzzr://67c3f2d2636e086e35ab8de5c6287107c837c7f79dca56b84f91dbce61577466"]},"browser/DelegatedWallet.sol":{"keccak256":"0x2b7f0eadba3c730a38cc491418e534fb681735e060974d924791f275af595454","urls":["bzzr://76e0303d7a9adeda2923dda447c9c07f098a254fb5c7dea4c0e828d9c7eb5548"]},"browser/EAC.sol":{"keccak256":"0xb6294e3c1215b5eca1d73d16fcdf59ec3d026a83cd2e9964cae57d3621d1dbb0","urls":["bzzr://428e0305259f503aaff72d487bd659d5a2685c7409caab6fd2cbe7743d6ed41c"]},"browser/ERC20.sol":{"keccak256":"0xc0c2a9e39291a1f81dadc79b32ffa98ad140db8a34d727ce9cf9123330273fa7","urls":["bzzr://3806c56145c943d86d5259f4568b89653f909584d80d36328b9857b66bc66e0f"]},"browser/LibList.sol":{"keccak256":"0x7ad08da5b76be5edd37641e3aa490919fe170ae3bb486705cce21f174a4f1815","urls":["bzzr://c8bca85e62038173752f6677ed717afb3dc72abd2e3e519748e2ff45b09d4a5e"]},"browser/Owned.sol":{"keccak256":"0x76e3ecfc01b94b4190e4a87226d080175b7fd1cd26b1d4e0b6c35492d00dfa8a","urls":["bzzr://843255a28650a2ef7814c6840d27be76fab0217da15053a201f79fe9dd14ca1f"]},"browser/PaymentScheduler.sol":{"keccak256":"0xec22ad04e32465a3acd70e888e90fbdbfbcbcc8408eef50f51f95f3388ca770a","urls":["bzzr://f5a4628b1fa515d0017cf8e9aee36699aed320ce310ae89c80e8f90cf5e8d15d"]}},"version":1};
    
    var PriceFeed = web3.eth.contract(metadata.output.abi).at('0x6BBc6F0Fdd858Bb746386C502f94DaBFb7333Bc0');

    var service = {
        get: function(tokenA, tokenB) {
            var deferred = $q.defer();
            
            if(tokenA == 'eth' && tokenB == 'usd'){
                PriceFeed.getETHperUSD(function(err, value){
                    if(!err)
                        deferred.resolve(value);
                    else
                        deferred.reject(err);
                });
            } else if(tokenA == 'usd' && tokenB == 'eth'){
                PriceFeed.getUSDperETH(function(err, value){
                    if(!err)
                        deferred.resolve(value);
                    else
                        deferred.reject(err);
                });
            } else {
                deferred.reject('Invalid token combination.')
            }
            
            return deferred.promise;
        }
    };
    
    return service;
}]);