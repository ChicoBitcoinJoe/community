#README
This is an implementation of Community using Material Design. This will probably be the main reference implementation for using LinkDB to create a decentralized, distributed, and censorship resistant content network.


Unsorted
========




Critical
========
- Metamask loading late
- lastBlock for fetching events not being updated
- post scores
- private voting
- public voting
- all lists need to be sorted properly
- Community fund button
- settings sidenav backend
- Multi/Community sidenav score


NonCritical
===========
- Community Sidenav
    - Turn into directive
    - Account panel username not editable (need name registry)
    - Multi/Community sidenav stats button
    
- postView
    - submit post does not preview the comment section

- Settings Sidenav
    - Turn into directive
    - post-card sizes (compact,comfortable,loose)
    - Adjustable theme colors
    
    
Notes
=====
- Post: Has a title and at least a comment or link and no parent
- Comment: Must have at least one parent and at least a comment and no title
- Xpost: shard name of broadcast contract and post.postCommunity do not match

{"SavedMultis":{"all":["community","cats","dogs","horses","bitcoin","ethereum","monero","politics"],"cryptocurrencies":["bitcoin","ethereum","monero"],"animals":["cats","dogs","horses"],"ungrouped":["community","politics"]},"SavedPosts":{},"SavedComments":{},"WebOfTrust":{"primary":[],"secondary":[],"banned":[]},"AutoModerator":{"users":{"0x153437ff3650fb550d98d68f4e28330069612c6a":{"honestVotes":["QmQK176D7ytLhGQgqYifSPG4NCXnFx1K3ZGPZhpnohDQf6"],"dishonestVotes":[],"score":51}}}}