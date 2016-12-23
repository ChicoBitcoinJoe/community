# To Do's #

## Unsorted ##
- none

## Critical ##

- General
    - Need to estimated gas fee
    - all lists need to be sorted properly

- Vote Contract
    - Community tokens

- Settings sidenav
    - backend

- Name Registry
    - Account panel username

- Comments
    - Need markdown
    - Comment will not show if the comment chain does not reach the root
    - Comment reply has no preview


## NonCritical ##
    
- Post View
    - submit post does not preview the comment section
    - video preview frame temprorarily disabled since it does not play nice with Mist

- Comments
    - You can upvote or downvote yourself
    - submit comment button doesnt update after clicking

- Create Community
    - Card is dreadful
    
## Backburner ##

- Need to prune old data from localStorage // Implemented but not tested!
- Metamask loading late occasionally *Metamask hard at work here*

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
- I'm currently using an MIT license. What is the significance of MiniMe being GNU?

