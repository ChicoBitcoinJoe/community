pragma solidity ^0.4.4;

contract VoteHub {
    
    address owner;
    address multisig1;
    address multisig2;
    
    address fund_contract;
    
    address new_fund_contract;
    address new_multisig1;
    address new_multisig2;
    
    struct Vote {
        uint weight;
        bool support;
    }
    
    struct Community {
        uint upvotes;
        uint downvotes;
    }
    
    struct Voter {
        uint total_tokens;
        
        mapping (string => uint) available_tokens;
        mapping (string => uint) upvotes;
        mapping (string => uint) downvotes;
    }
    
    mapping (string => Community) Communities;
    mapping (address => Voter) Voters;
    
    function VoteHub(address fundContract){
        owner = msg.sender;
        multisig1 = msg.sender;
        multisig2 = msg.sender;
        new_multisig1 = msg.sender;
        new_multisig2 = msg.sender;
        fund_contract = fundContract;
        new_fund_contract = fundContract;
    }
    
    function fundDevelopment(string community){
        if(msg.value == 0)
            throw;
        
        Voters[msg.sender].total_tokens += msg.value;
        Voters[msg.sender].available_tokens[community] += msg.value;
        
        if(!fund_contract.send(msg.value))
            throw;
    }
    
    function vote(string community, string key, uint amount, bool support){
        uint available = Voters[msg.sender].available_tokens[community];
        if(available > 0){
            if(amount < available){
                if(support){
                    Communities[key].upvotes += amount;
                    Voters[msg.sender].upvotes[key] += amount;
                } else {
                    Communities[key].downvotes += amount;
                    Voters[msg.sender].downvotes[key] += amount;
                }
                Voters[msg.sender].available_tokens[community] -= amount;
            } else {
                if(support)
                    Communities[key].upvotes += available;
                else
                    Communities[key].downvotes += available;
                
                Voters[msg.sender].available_tokens[community] = 0;
            }
        }
    }
    
    function reclaimVotes(string community, string key){
        var upvotes = Voters[msg.sender].upvotes[key];
        var downvotes = Voters[msg.sender].downvotes[key];
        
        Voters[msg.sender].upvotes[key] = 0;
        Voters[msg.sender].downvotes[key] = 0;
        
        Communities[key].upvotes -= upvotes;
        Communities[key].downvotes -= downvotes;
        
        var refund = upvotes + downvotes;
        Voters[msg.sender].available_tokens[community] += refund;
    }
    
    function getCommunityVotes(string community, string key){
        //get key upvotes/downvotes
        
    }
    
    function getUserData(){
        //get user votes
        
    }
    
    function changeOwner(address newOwner){
        if(msg.sender == owner)
            owner == newOwner;
    }
    
    function changeMultiSig1(address newMultisig1){
        if(msg.sender == owner)
            new_multisig1 = newMultisig1;
    }
    
    function changeMultiSig2(address newMultisig2){
        if(msg.sender == owner)
            new_multisig2 = newMultisig2;
    }
    
    function changeFundContractProposal(address newFundContract){
        if(msg.sender == owner)
            new_fund_contract = newFundContract;
    }
    
    function confirmNewContract(address contractToConfirm){
        if(msg.sender == multisig1 || msg.sender == multisig2){
            if(contractToConfirm == new_fund_contract)
                fund_contract = new_fund_contract;
        }
    }
    
    function confirmNewMultisig1(){
        if(msg.sender == multisig2)
            multisig1 = new_multisig1;
    }
    
    function confirmNewMultisig2(){
        if(msg.sender == multisig1)
            multisig2 = new_multisig2;
    }
    
    function accountCompromised(){
        //How to handle this?
    }
}