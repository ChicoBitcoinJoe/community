pragma solidity ^0.4.23;

contract Community {
    
    function post (string communityName, string postHash, string parentHash) public {
        emit Post_event(communityName, postHash, parentHash);
    }
    
    event Post_event(string indexed communityName, string indexed postHash, string parentHash);
    
}