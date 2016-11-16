## Community
Community is a reference implementation of a Reddit clone using the LinkDB Contract.

When looking at Facebook, Twitter, Reddit, Instagram ... etc, you can generalize them as a third party hooking together content with an audience. There is huge amounts of overlap between the userbases and by extension the content (through xposting) and the only difference between these third parties is how that content is delivered to the audience. LinkDB is a completely open hub for submitting content, decoupling third parties from their userbases and content, allowing anyone to tap into the existing LinkDB network effect. Any developer with a new vision for delivering content can tap into LinkDBs network effect without having to maintain a server, accrue users, throw annoying ads at users to pay for said servers, and many other hassles. Link aims to make creating a social media/news site so easy an ametuer web designer can pick it up with little to no issues.

Other topics I need to expand on:
- Open Source
- Freedom of Speech
- Self Moderation
- Ad free
- Proper incentives

# Prerequisites
*Read Only Mode is available by using the ipfs gateway combined with metamask. Otherwise...

1. Ipfs needs to be installed. Using Chrome on windows I also had to run in a command prompt
    - ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
    - ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"GET\", \"POST\"]"
    - ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
2. Some method to expose the web3 object to your client (Mist/Geth/Metamask)


# Installing
1. Open a command prompt and run "ipfs daemon". Verify that the ipfs daemon is running appropriately. It should look something like...
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
    
2. There are two ways you can get the Community code
    - If Git is installed run "git clone https://github.com/ChicoBitcoinJoe/Community"
    - If you have a Ipfs hash (Qm1a2b3c...) of a certain version of Community you can run "ipfs get Qm1a2b3c..." to get that version. Todo: Add a permanent ipfs hash that autoforwards to the newest version of community


3. From a command prompt in the Community folder run "ipfs add -r -q Community | tail -n1" to get an Ipfs hash of the folder. The hash should be the same as step 2 (Unless I forget to update the hash when I push. I'll try to figure out a better way to do this).

4. Browse to http://localhost:8080/ipfs/IPFS_HASH_FROM_STEP_3/ (Make sure you have web3 exposed and have the ipfs daemon running!)

5. Every time you make a change in the Community folder you need to repeat steps 3 and 4

# Tips
- To copy straight to clipboard "ipfs add -r -q Community | tail -n1 | clip"
- For more verbose output "ipfs add -r Community"