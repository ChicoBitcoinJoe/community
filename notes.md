# To Do's #

## Unsorted ##
- Create Community does not properly watch for submission into block before showing submit post card
- When submitting a post and waiting for a txreceipt: inpage-provider.js:89 Uncaught Error: The MetaMask Web3 object does not support synchronous methods like eth_uninstallFilter without a callback parameter.
- Need to calculate estimated gas fee

## Critical ##
-General
    - Metamask loading late
        - only on slow internet connections?

- Vote Contract
    - all lists need to be sorted properly
    - Multi/Community tokens
    - public/private post scores
    - settings sidenav backend

- Need Name Registry
    - Account panel username


## NonCritical ##
- Community Sidenav
    - Turn into directive
    - Multi sidenav stats button
    
- postView
    - submit post does not preview the comment section

- Settings Sidenav
    - Turn into directive
    



    
# Notes #
- Post: Has a title, no parents, and at least a body or link
- Comment: Must have a root parent, a parent, a body, no title, and media=='self'
- A "Tweet": No root parent, no title, at least a link or body
- Xpost: event community does not equal ipfs data community
- repost: event poster does not equal ipfs data community


LinkDB:{
    shard_addresses:{
        shardName:{
            shardAddress:'0xabc',
            created:0,
            last_block_seen:0
        }
    }
}


ipfsHash: {
    eventData:{
        poster:'0x123',
        ipfsHash:'Qm123',
        txHash:'23a5ntr6...'
    },
    ipfsData:{
        poster:'0xabc',
        root_parent:'Qmefg',
        parent:'Qm...',
        media: 'text', //[text,web,image,audio,video,...]
        media_link:'QmL1nK', //[ipfshash, url]
        title:'title,
        content:'Comment',
    },
    children:['Qmabc','Qmxyz'],
    posters:['0xjkl','0x789']
}


userProfile:{
    users:{
        '0xUserAccount':{
            score:0,
            upvotes:[],
            downvotes:[]
        },
        ...
    },
    favorited:[]
}