Community.service('LinkDB', ['$q', function ($q) {
    console.log('Loading LinkDB');
    
    //var LinkAddress = '0x3D58740553f31267577CB85BabF4D0Ed64f54541'; //PrivateNet
    var LinkAddress = '0xB87fd0bD60FEC6FE0A5930Bbb90210C3F7d86EaE '; //TestNet
    var LinkContract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"shardName","type":"string"}],"name":"createShard","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getShardName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"shardName","type":"string"}],"name":"getShardAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_shards","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDeveloperDaoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"}]);
    var LinkInstance = LinkContract.at(LinkAddress);
  
    var ShardAbi = [{"constant":false,"inputs":[{"name":"metadata","type":"string"}],"name":"broadcast","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"content","type":"string"},{"name":"support","type":"int256"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"metadata","type":"string"}],"name":"Broadcast_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"topic","type":"string"},{"indexed":false,"name":"support","type":"int256"}],"name":"Vote_event","type":"event"}];
    var ShardContract = web3.eth.contract(ShardAbi);
    
    
    var LinkDB = JSON.parse(localStorage.getItem('LinkDB'));
    if(!LinkDB){
        LinkDB = {
            Broadcast_events:{
            /*  shard:{
                    events:{
                        txHash: {
                            txHash: event.transactionHash,
                            community: community,
                            poster: poster,
                            block: event.blockNumber,
                            metadata: event.args.metadata
                        }
                    }
                }//*/
            },
            Vote_events:{
            /*  shard:{
                    events: {
                        txHash: {
                            ???
                        }
                    }
                }//*/
            },
            Shard_addresses:{
                //shardName: shardAddress
            }
        };

        localStorage.setItem('LinkDB',JSON.stringify(LinkDB));
    }
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var service = {
        
    }
    
	return service;
}]); 