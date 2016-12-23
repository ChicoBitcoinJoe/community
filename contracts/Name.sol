pragma solidity ^0.4.6;

contract Name {
    
    mapping (address => string) name;
    
    function put(string _name){
        name[msg.sender] = _name;
    }
    
    function get(address _address) constant returns(string){
        return name[_address];
    }
}