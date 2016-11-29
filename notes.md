# To Do's #

## Unsorted ##
- submit comment not setting root_parent properly
- One vote per comment not working occasionally
- post scores not updating correctly in multiView and communityView?

## Critical ##
- General
    - Metamask loading late
        - only on slow internet connections?
    - all lists need to be sorted properly

- Vote Contract
    - Multi/Community tokens
    - public
    - settings sidenav backend

- Need Name Registry
    - Account panel username

- Need to calculate more accurate estimated gas fee

- Loading up a post directly does not work if the txHash event has not already been saved
    - submit post needs to wait for event to be seen

## NonCritical ##
- Community Sidenav
    - Turn into directive
    - Multi sidenav stats button
    
- postView
    - submit post does not preview the comment section
    - video preview frame not updating when link provided

- Settings Sidenav
    - Turn into directive
    
- You can upvote or downvote yourself

- Create Community card is dreadful

- submit comment button doesnt update text after clicking



    
# Notes #
- Post: Has a title, no parents, and at least a comment or link
- Comment: Must have a root parent, a parent, a comment, no title, and media=='self'
- A "Tweet": No root parent, no title, at least a link or comment
- Xpost: event community does not equal ipfs data community
- repost: event poster does not equal ipfs data community
