# Community

This repo is an implementation of a *Reddit-like* site using Ethereum, Ipfs and the Share Platform (A collection of smart contracts on the Ethereum blockchain). A presentation about Community can be found at [this slide show](https://docs.google.com/presentation/d/1oiCmJcrn15-kK3xS-UzPbx5M1LAyRlGRRJ6q4qllw0E/edit?usp=sharing). Features include:

- AutoModeration
- Ad Free
- Material Design UX
- User data stays local
- Sybil/Brigade Resistance
- Decentralized/Distributed
- and much more planned for the future!


### Prerequisites

1. First choose how you want to expose the web3 object.
    - [Mist](https://github.com/ethereum/mist/releases)
    - [Geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)
    - [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)  
2. [Ipfs](https://ipfs.io/docs/install/) needs to be installed. Using Chrome on Windows 7 I also had to run in a command prompt
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

### Rolling Your Own Community

1. If Git is installed run "git clone https://github.com/ChicoBitcoinJoe/Community". Otherwise you can download it directly from github.
2. Open a command prompt in the location of your Community folder and run "ipfs add -r -q Community-Folder_Name" to get an Ipfs hash of the Community folder. It will be the very last hash to be printed and it will start with 'Qm...'
3. Browse to http://localhost:8080/ipfs/COPY_IPFS_HASH_FROM_STEP_2_HERE/ (Make sure you have web3 exposed and have the ipfs daemon running!)
4. Every time you make a change in the Community folder you need to repeat steps 2 and 3

### Tips

- To copy the ipfs hash straight to the clipboard use "ipfs add -r -q Community_Folder_Name | tail -n1 | clip" (must have tail and clip installed)
- For more verbose ipfs output use "ipfs add -r Community_Folder_Name"
