# To Do's #

## Unsorted ##
- Need to prune old data from localStorage
- Comment will not show if the comment chain does not reach the root
- switching between two communities too quickly will incorrectly load both communities

## Critical ##
- General
    - Metamask loading late
        - only on slow internet connections?
    - all lists need to be sorted properly

- Vote Contract
    - Community tokens
    - settings sidenav backend

- Name Registry
    - Account panel username

- Need to calculate more accurate estimated gas fee
- Still fetching all events
    - last block seen not being updated


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
- submit comment button doesnt update after clicking


    
# Notes #
- Post: Has a title, no parents, and at least a comment or link
- Comment: Must have a root parent, a parent, a comment, no title, and media=='self'
- A "Tweet": No root parent, no title, at least a link or comment
- Xpost: event community does not equal ipfs data community
- repost: event poster does not equal ipfs data community


# MiniMe Token Questions
- Keep ERC20 compliance if using for a DAO
    - otherwise, what is safe to change?
- How to keep Share Contract intact after split?
- How does the transfersEnabled process work?
    - Can a clone unfreeze tokens?
- Can using a higher compiler version (for added security benefits) break the contract?
- What happens if the contract breaks down the line?
    - Can user balances be moved to a new secure contract easily?
    - Do the tools exist to help facilitate the above?
- My current contract never moves tokens to other users but only internally to voting balances.
    - How difficult would it be to clone the internal accounts as well?
- I'm currently using an MIT license. WHat is the significance of MiniMe being GNU?















