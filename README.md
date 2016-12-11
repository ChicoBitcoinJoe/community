# Community
This repo is an implementation of a *Reddit-like* site using the Share Platform and a Material Design UX.

A presentation detailing how Community works can be found at [this slide show](https://docs.google.com/presentation/d/1oiCmJcrn15-kK3xS-UzPbx5M1LAyRlGRRJ6q4qllw0E/edit?usp=sharing)


### Prerequisites

*Read Only Mode is available by using the ipfs gateway combined with metamask. Otherwise you need...

1. Some method to expose the web3 object to your client
    - [Mist](https://github.com/ethereum/mist/releases)
    - [Geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)
    - [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
    
2. Run an Ipfs daemon. Open a command prompt and run "ipfs daemon". Verify that the ipfs daemon is running appropriately. It should look something like...
    * Initializing daemon...
    * Swarm listening on /ip4/127.0.0.1/tcp/4001
    * Swarm listening on /ip4/169.254.150.233/tcp/4001
    * Swarm listening on /ip4/169.254.190.105/tcp/4001
    * Swarm listening on /ip4/192.168.42.196/tcp/4001
    * Swarm listening on /ip4/192.168.99.1/tcp/4001
    * Swarm listening on /ip6/2607:fb90:a4ec:c6b2:900:5d14:8c0b:d38d/tcp/4001
    * Swarm listening on /ip6/2607:fb90:a4ec:c6b2:d083:c7d2:3012:54df/tcp/4001
    * Swarm listening on /ip6/2620:9b::1944:ab10/tcp/4001
    * Swarm listening on /ip6/::1/tcp/4001
    * API server listening on /ip4/127.0.0.1/tcp/5001
    * Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080
    * Daemon is ready

### Installing
1. If Git is installed run "git clone https://github.com/ChicoBitcoinJoe/Community". Otherwise you can download it directly using github.

2. Open a command prompt in the same folder as the Community folder and run "ipfs add -r -q Community-Folder_Name | tail -n1" to get an Ipfs hash of the Community folder.

3. Browse to http://localhost:8080/ipfs/COPY_IPFS_HASH_FROM_STEP_2_HERE/ (Make sure you have web3 exposed and have the ipfs daemon running!)

4. Every time you make a change in the Community folder you need to repeat steps 2 and 3

### Tips
- To copy the ipfs hash straight to the clipboard use "ipfs add -r -q Community_Folder_Name | tail -n1 | clip"
- For more verbose ipfs output use "ipfs add -r Community_Folder_Name"
