pragma solidity ^0.4.6;

contract Shard{
    
    string name;
    uint created;
    
    event Share_event(string shardName, string ipfsHash);

    function Shard(string _shard_name){
        name = _shard_name;
        created = block.number;
    }
    
    function getShardInfo() constant returns(string,uint){
        return (name,created);
    }
    
    function share(string ipfsHash){
        Share_event(name, ipfsHash);
    }
}