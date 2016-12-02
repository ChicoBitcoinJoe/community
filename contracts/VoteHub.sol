pragma solidity ^0.4.6;

contract VoteHub {
    
    address owner;
    address fund_contract;
    
    struct Community {
        uint total_tokens;
        mapping(string => Key) keys;
    }
    
    struct Key {
        uint upvotes;
        uint downvotes;
    }
    
    struct Voter {
        uint total_tokens;
        
        mapping (string => uint) available_tokens;
        mapping (string => Community) Communities;
    }
    
    uint total_tokens = 0;
    mapping (string => Community) Communities;
    mapping (address => Voter) Voters;
    
    function VoteHub(address fundContract){
        owner = msg.sender;
        fund_contract = fundContract;
    }
    
    function fundDevelopment(string community) {
        if(msg.value == 0)
            throw;
        
        total_tokens += msg.value;
        Voters[msg.sender].total_tokens += msg.value;
        Voters[msg.sender].available_tokens[community] += msg.value;
        Voters[msg.sender].Communities[community].total_tokens += msg.value;
        
        if(!fund_contract.send(msg.value))
            throw;
    }
    
    function vote(string community, string key, uint amount, bool support){
        uint available = Voters[msg.sender].available_tokens[community];
        if(available > 0){
            if(amount < available){
                if(support){
                    Communities[community].keys[key].upvotes += amount;
                    Voters[msg.sender].Communities[community].keys[key].upvotes += amount;
                } else {
                    Communities[community].keys[key].downvotes += amount;
                    Voters[msg.sender].Communities[community].keys[key].downvotes += amount;
                }
                Voters[msg.sender].available_tokens[community] -= amount;
            } else {
                if(support)
                    Communities[community].keys[key].upvotes += available;
                else
                    Communities[community].keys[key].downvotes += available;
                
                Voters[msg.sender].available_tokens[community] = 0;
            }
        }
    }
    
    function reclaimVotes(string community, string key){
        var upvotes = Voters[msg.sender].Communities[community].keys[key].upvotes;
        var downvotes = Voters[msg.sender].Communities[community].keys[key].downvotes;
        
        Communities[community].keys[key].upvotes -= upvotes;
        Communities[community].keys[key].downvotes -= downvotes;
        
        Voters[msg.sender].Communities[community].keys[key].upvotes = 0;
        Voters[msg.sender].Communities[community].keys[key].downvotes = 0;
        
        var refund = upvotes + downvotes;
        Voters[msg.sender].available_tokens[community] += refund;
    }
    
    function getKeyVotes(string community, string key) constant returns(uint,uint){
        //get key upvotes/downvotes
        var upvotes = Communities[community].keys[key].upvotes;
        var downvotes = Communities[community].keys[key].downvotes;
        
        return (upvotes,downvotes);
    }
    
    function getUserVotes(address user, string community, string key) constant returns (uint,uint){
        var upvotes = Voters[user].Communities[community].keys[key].upvotes;
        var downvotes = Voters[user].Communities[community].keys[key].downvotes;
        
        return (upvotes,downvotes);
    }
    
    function getUserData(address user, string community) constant returns(uint,uint,uint){
        var total_tokens = Voters[user].total_tokens;
        var available_tokens = Voters[user].available_tokens[community];
        var community_tokens = Voters[user].Communities[community].total_tokens;
        
        return (available_tokens,community_tokens,total_tokens);
    }
    
    function changeOwner(address newOwner){
        if(msg.sender == owner)
            owner == newOwner;
    }
    
    function changeFundContract(address newFundContract){
        if(msg.sender == owner)
            fund_contract == newFundContract;
    }
    
    function getDetails() constant returns (address,address,uint){
        return (owner,fund_contract,total_tokens);
    }
}