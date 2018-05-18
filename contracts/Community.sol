pragma solidity ^0.4.23;

contract Community {
    
    function post (string communityName, string postHash) public {
        emit Post_event(communityName, postHash);
        emit Index_event(keccak256(communityName), postHash);
    }
    
    function comment (string commentHash, string parentHash) public {
        emit Comment_event(commentHash, parentHash);
        emit Index_event(commentHash, parentHash);
    }
    
    event Post_event(string communityName, string postHash);
    event Comment_event(string commentHash, string parentHash);
    event Index_event(bytes32 indexed communityName, string indexed postHash);
    event Index_event(string indexed commentHash, string indexed parentHash);
    
}