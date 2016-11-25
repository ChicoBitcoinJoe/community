pragma solidity ^0.4.6;

contract Shard{
    
    string shardName;
    uint block_created;
    
    event Share_event(address indexed sender, string ipfsHash);

    function Shard(string shard_name){
        shardName = shard_name;
        block_created = block.number;
    }
    
    function getShardInfo() constant returns(string,uint){
        return (shardName,block_created);
    }
    
    function share(string ipfsHash){
        Share_event(msg.sender, ipfsHash);
    }
}