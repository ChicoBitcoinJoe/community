pragma solidity ^0.4.4;

contract VoteHub {
    
    address developer;
    
    uint total_shards = 0;
    mapping (uint => string) shardIndex;
    mapping (string => address) shardList;
    
    function VoteHub(){
        developer = msg.sender;    
    }
    
    function fundDevelopment(string shardName, uint percent_split, address split_address){
        VoteShard(shardList[shardName]).credit(msg.sender,msg.value);
        var success = developer.send(msg.value);
    }
}

contract VoteShard{
    
    string name;
    uint total_credits;
    
    struct Thing {
        uint total_votes;
        mapping (address => uint) voters;
    }
    
    mapping (address=>uint) voteFunds;
    mapping (string => Thing) voteData; //Needs to be priority list eventually
    
    function VoteShard(string shardName){
        name = shardName;
    }
    
    function credit(address sender, uint value){
        voteFunds[sender] += value;
        total_credits += value;
    }
    
    function vote(string thing, uint amount){
        if(voteFunds[msg.sender] >= amount){
            voteFunds[msg.sender] -= amount;
            voteData[thing].voters[msg.sender] += amount;
            voteData[thing].total_votes += amount;
        }
    }
    
    function reclaimVotes(string thing){
        var amount = voteData[thing].voters[msg.sender];
        voteFunds[msg.sender] += amount;
        voteData[thing].total_votes -= amount;
        delete voteData[thing].voters[msg.sender];
    }
}