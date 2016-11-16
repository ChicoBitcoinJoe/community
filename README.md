#README
This is an implementation of Community using Material Design. This will probably be the main reference implementation for using LinkDB to create a decentralized, distributed, and censorship resistant content network.


Unsorted
========




Critical
========

General
- Metamask loading late
- lastBlock for fetching events not being updated
- private post scores

Vote Contract
- Community fund button
- all lists need to be sorted properly
- Multi/Community sidenav score
- public post scores
- settings sidenav backend

Need Name Registry
- Account panel username


NonCritical
===========
- Community Sidenav
    - Turn into directive
    - Multi sidenav stats button
    
- postView
    - submit post does not preview the comment section

- Settings Sidenav
    - Turn into directive
    
    
Notes
=====
- Post: Has a title and at least a comment or link and no parent
- Comment: Must have at least one parent and at least a comment and no title
- Xpost: shard name of broadcast contract and post.postCommunity do not match
