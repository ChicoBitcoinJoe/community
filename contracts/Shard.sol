pragma solidity ^0.4.4;

contract Shard{
    event Broadcast_event(string metadata);

    function broadcast(string metadata){
        Broadcast_event(metadata);
    }
}