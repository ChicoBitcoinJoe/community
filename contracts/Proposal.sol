pragma solidity ^0.4.6;

import "Owned.sol";

contract ProposalList is Owned {
    
    uint total_tokens;
    mapping (address => uint) tokens;
    
    struct Proposal {
        uint tokens;
        string hash;
        uint timestamp;
        address submitter;
    }
    
    struct Vote {
        uint proposal_id;
        uint weight;
    }
    
    uint total_proposals;
    mapping (uint => Proposal) proposals;
    mapping (address => Vote) votes;
    uint best_proposal_id;
    uint locked;
    
    function getBestProposalHash() constant returns(string){
        return proposals[best_proposal_id].hash;
    }
    
    function getProposalInfo(uint _id) constant returns(uint, string, uint, address){
        Proposal p = proposals[_id];
        return (p.tokens,p.hash,p.timestamp,p.submitter);
    }
    
    function supportProposal (uint _id) {
        uint old_vote_id = votes[msg.sender].proposal_id;
        if(old_vote_id > 0)
            removeSupport(old_vote_id);
        
        votes[msg.sender].proposal_id = _id;
        uint balance = tokens[msg.sender];//TokenContract.getBalance(msg.sender);
        proposals[_id].tokens += balance;
    }
    
    function removeSupport (uint _id) private {
        uint balance = votes[msg.sender].weight;
        proposals[_id].tokens -= balance;
        votes[msg.sender].proposal_id = 0;
    }
    
    event NewProposal_event(uint id, string hash);
    function submitProposal (string _hash) {
        total_proposals++;
        proposals[total_proposals] = Proposal(0,_hash,block.timestamp,msg.sender);
        
        NewProposal_event(total_proposals, _hash);
    }
    
    event ApprovedProposal_event(uint id, string hash);
    function approveProposal (uint _id) {
        uint proposal_tokens = proposals[_id].tokens;
        uint other_tokens = total_tokens - proposal_tokens;
        
        bool unlocked = (block.timestamp-locked) > 30 days;
        bool majority = proposal_tokens > other_tokens;
        
        if(unlocked && majority){
            best_proposal_id = _id;
            locked = block.timestamp;
            
            ApprovedProposal_event(_id,proposals[best_proposal_id].hash);
        }
    }
    
    event DeletedProposal_event(uint id, string hash);
    function deleteProposal (uint _id) {
        uint proposal_tokens = proposals[_id].tokens;
        uint other_tokens = total_tokens - proposal_tokens;
        
        bool deletable = (block.timestamp-proposals[_id].timestamp) > 30 days;
        bool super_minority = proposal_tokens < other_tokens/100;
        
        if(deletable && super_minority){
            string hash = proposals[_id].hash;
            delete proposals[_id];
            DeletedProposal_event(_id, hash);
        }
    }
}
