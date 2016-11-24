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