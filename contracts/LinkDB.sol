pragma solidity ^0.4.4;

import "Shard.sol";

contract LinkDB {
    
    event CreateShard_event(string shardName);
    
    uint total_shards = 0;
    mapping (uint => string) shardIndex;
    mapping (string => address) shardList;

    function createShard(string shardName){
        if(shardList[shardName] == 0){
            total_shards++;
            shardIndex[total_shards] = shardName;
            shardList[shardName] = new Shard(shardName);
            
            CreateShard_event(shardName);
        }
    }
    
    function getTotalShards() constant returns(uint){
       return total_shards;
    }
    
    function getShardName(uint index) constant returns(string){
       return shardIndex[index];
    }
    
    function getShardAddress(string shardName) constant returns(address){
        return shardList[shardName];
    }
}