pragma solidity ^0.4.4;

contract Shard{
    
    string shardName;
    
    event Broadcast_event(address indexed sender, string ipfsHash);

    function Shard(string shard_name){
        shardName = shard_name;
    }
    
    function getShardName() constant returns(string){
        return shardName;
    }
    
    function broadcast(string ipfsHash){
        Broadcast_event(msg.sender, ipfsHash);
    }
}