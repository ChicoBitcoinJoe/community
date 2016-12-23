# Community

This repo is an implementation of a *Reddit-like* site using Ethereum, Ipfs and a collection of smart contracts on the Ethereum blockchain. 

The Community white paper can be found [here](https://docs.google.com/document/d/1IW3YqxdpveDtERUvkXtVLSdQH8o17xq7eptDbHu08es/edit#) 

Features on release will include:

- AutoModeration
- Ad Free
- Material Design UX
- Your personal information stays private!
- Sybil/Brigade Resistance
- Decentralized/Distributed
- and much more planned for the future!


### Prerequisites and Setup

1. First choose how you want to expose the web3 object.
    - [Metamask - chrome extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) (recommended)
    - [Mist - web3 compatible browser](https://github.com/ethereum/mist/releases) (medium)
    - [Geth - locally hosted web3 client](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) (hard)
2. [Ipfs](https://ipfs.io/docs/install/) needs to be installed. Using Chrome on Windows 7 I also had to run in a command prompt
    - ipfs init
    - ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
    - ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"GET\", \"POST\"]"
    - ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
3. Start your ipfs node by typing into a command window "ipfs daemon". If the ipfs daemon is running appropriately it should look something like...
    
    ```
    Initializing daemon...
    Swarm listening on /ip4/127.0.0.1/tcp/4001
    Swarm listening on /ip4/169.254.150.233/tcp/4001
    Swarm listening on /ip6/2607:fb90:a4ec:c6b2:900:5d14:8c0b:d38d/tcp/4001
    Swarm listening on /ip6/2607:fb90:a4ec:c6b2:d083:c7d2:3012:54df/tcp/4001
    Swarm listening on /ip6/::1/tcp/4001
    API server listening on /ip4/127.0.0.1/tcp/5001
    Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080
    Daemon is ready
    ```

4. Browse to http://localhost:8080/ipfs/QmbKfUcPfuRqpqe85Zs93j99zh9ZY7MpaVn4ndwWpXNBMc/


### Developing Your Own Community UX

1. Get a copy of Community. There are two ways to do this:
    -Download it directly from [github](https://github.com/ChicoBitcoinJoe/Community) (find the "Clone or Download" button)
    - Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and run "git clone https://github.com/ChicoBitcoinJoe/Community". 
3. Open a command prompt in the location of your Community folder and run "ipfs add -r -q Community_Folder_Name" to get an Ipfs hash of the Community folder. It will be the very last hash to be printed and it will start with 'Qm...'
4. Browse to http://localhost:8080/ipfs/COPY_IPFS_HASH_FROM_STEP_2_HERE/ (Make sure you have web3 exposed and have the ipfs daemon running!)
5. Every time you make a change in the Community folder you need to repeat steps 3 and 4


### Tips

- To copy the ipfs hash straight to the clipboard use "ipfs add -r -q Community_Folder_Name | tail -n1 | clip" (must have tail and clip installed)
- For more verbose ipfs output use "ipfs add -r Community_Folder_Name"
