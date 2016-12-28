pragma solidity ^0.4.6;

contract Channel{
    
    string channelName;
    uint block_created;
    
    event Broadcast_event(string hash);

    function Channel(string _channel_name){
        channelName = _channel_name;
        block_created = block.number;
    }
    
    function getChannelInfo() constant returns(string,uint){
        return (channelName,block_created);
    }
    
    function broadcast(string ipfsHash){
        Broadcast_event(ipfsHash);
    }
}