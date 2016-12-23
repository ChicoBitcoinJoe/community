pragma solidity ^0.4.6;

contract Names {
    
    //What's in a name?
    struct Name {
        string name;
        bool touched;
    }
    
    mapping (address => Name) name;
    
    function set(string _name){
        name[msg.sender].touched = true;
        name[msg.sender].name = _name;
    }
    
    function get(address account) constant returns(string){
        if(name[account].touched)
            return name[account].name;
        else
            return 'anonymous';
    }
}