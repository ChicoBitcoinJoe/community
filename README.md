#README
This is an implementation of Community using Material Design. This will probably be the main reference implementation for using LinkDB to create a decentralized, distributed, and censorship resistant content network.


Unsorted
========
- Multi sidenav stats button
- Community fund button
- settings sidenav backend


Critical
========
- Metamask loading late
- Comments
- lastBlock not being checked before sending out events request
- Unwatch communities after were done with them (services/EventHandler.js)


NonCritical
===========
- Community Sidenav
    - Turn into directive
    - Account panel username not editable (need name registry)
    
- header
    - toolbar height not consistent for all widths

- Settings Sidenav
    - Turn into directive
    - post-card sizes (compact,comfortable,loose)
    - Adjustable themes
    
    
Notes
=====
- Post: Has a title and at least a comment or link
- Comment: Must have at least one parent and at least a comment or link