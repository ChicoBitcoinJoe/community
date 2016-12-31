Community.service('ProfileDB',['Web3Service','$q', function(Web3Service,$q){
    console.log('Loading ProfileDB account ');
    var ProfileDB = null;
    
    var saveProfileDB = function(){
        if(Web3Service.getCurrentAccount())
            localStorage.setItem(Web3Service.getCurrentAccount(),JSON.stringify(ProfileDB));
        else   
            console.log("Tried to save profile but no account to save to.");
    };
    
    var loadProfile = function(account){
       return JSON.parse(localStorage.getItem(account));
    };
    
    //console.log(Web3Service.getCurrentAccount());
    ProfileDB = loadProfile(Web3Service.getCurrentAccount());
    if(!ProfileDB){
        console.log('Could not find a profile. Using default profile');
        ProfileDB = {
            SavedMultis:{
                'all':['community','bitcoin','ethereum','monero','politics','flowers'],
                'cryptocurrencies':['bitcoin','ethereum','monero'],
                'flowers':['flowers'],
                'ungrouped':['community','politics']
            },
            favorited:{
            /*  community:[],
                ... */
            },
            users:{
            /*  user:{
                    score:0,
                    upvotes:[],
                    downvotes:[],
                    upvoteStreak:0;
                    downvoteStreak:0;
                }*/        
            },
            PostScores:{
                /*  community:{
                        txHash:{
                            score:0
                        }
                    }
                ... */
            }
        };

        saveProfileDB();
    }
    
    var touchUser = function(account){
        if(!ProfileDB.users[account]){
            ProfileDB.users[account] = {};
            ProfileDB.users[account].upvotes = [];
            ProfileDB.users[account].downvotes = [];
            ProfileDB.users[account].upvoteStreak = 0;
            ProfileDB.users[account].downvoteStreak = 0;
            ProfileDB.users[account].bestUpvoteStreak = 0;
            ProfileDB.users[account].worstDownvoteStreak = 0;
            ProfileDB.users[account].score = 50;
            //console.log("New user! Score:",ProfileDB.users[account].score);
        } else {
            //console.log("Existing user! Score:", ProfileDB.users[account].score);
        }
    };
    
    var touchPostScore = function(community,txHash){
        //console.log(community,txHash);
        if(!ProfileDB.PostScores[community]){
            ProfileDB.PostScores[community] = {};
            ProfileDB.PostScores[community].post = {};
        }
        
        if(!ProfileDB.PostScores[community].post[txHash]){
            //console.log("No Post Score Detected");
            ProfileDB.PostScores[community].post[txHash] = {};
            ProfileDB.PostScores[community].post[txHash].score = 0;
            ProfileDB.PostScores[community].post[txHash].posters = [];
        }
    };
    
    var touchFavorite = function(community){
        if(!ProfileDB.favorited[community])
            ProfileDB.favorited[community] = [];
    };
    
    var saveFavorite = function(community,txHash){
        //console.log(community,txHash,ProfileDB.favorited[community])
        if(ProfileDB.favorited[community].indexOf(txHash) == -1){
            ProfileDB.favorited[community].push(txHash);
            //console.log("Saved!",ProfileDB.favorited[community]);
        } else {
            //console.log("Already Saved!");
        }
    };
    
    var removeFavorite = function(community,txHash){
        //console.log(community,txHash,ProfileDB.favorited[community])
        var index = ProfileDB.favorited[community].indexOf(txHash);
        if( index !== -1){
            ProfileDB.favorited[community].splice(index,1);
            //console.log("Unsaved!",index, ProfileDB.favorited[community]);
        } else {
            //console.log("Not Saved!");
        }
    };
    
    var updateUserScore = function(account){
        //console.log(account);
        var upvoteStreak = ProfileDB.users[account].upvoteStreak;
        var downvoteStreak = ProfileDB.users[account].downvoteStreak;
        
        if(upvoteStreak){
            ProfileDB.users[account].score = Math.round(ProfileDB.users[account].score*1.1);
            
            if(upvoteStreak > ProfileDB.users[account].bestUpvoteStreak)
                ProfileDB.users[account].bestUpvoteStreak++;
        }
        
        if(downvoteStreak){
            ProfileDB.users[account].score = Math.round(ProfileDB.users[account].score*0.9);
            
            if(downvoteStreak > ProfileDB.users[account].worstDownvoteStreak)
                ProfileDB.users[account].worstDownvoteStreak++;
        }
    
        if(ProfileDB.users[account].score > 100)
            ProfileDB.users[account].score = 100;
        if(ProfileDB.users[account].score < 0)
            ProfileDB.users[account].score = 0;
        
        console.log(account + "'s new score is " + ProfileDB.users[account].score);
    };
    
    var upvoteUser = function(account,txHash){
        touchUser(account);
        
        var upvoteStreak = ProfileDB.users[account].upvoteStreak;
        if(ProfileDB.users[account].upvotes.indexOf(txHash) == -1){
            ProfileDB.users[account].upvotes.push(txHash);
            ProfileDB.users[account].upvoteStreak = upvoteStreak + 1;
            ProfileDB.users[account].downvoteStreak = 0;
            
            updateUserScore(account);
        } else
            console.log('user voted already');
    };
    
    var downvoteUser = function(account,txHash){
        touchUser(account);
        
        var downvoteStreak = ProfileDB.users[account].downvoteStreak;
        if(ProfileDB.users[account].downvotes.indexOf(txHash) == -1){
            ProfileDB.users[account].downvotes.push(txHash);
            ProfileDB.users[account].upvoteStreak = 0;
            ProfileDB.users[account].downvoteStreak = downvoteStreak + 1;
            
            updateUserScore(account);
        } else 
            console.log('user voted already');
    };
    
    var service = {
        getCurrentAccount: function(){
            return web3.eth.accounts[0];
        },
        getSavedMultis: function(){
            return Object.keys(ProfileDB.SavedMultis);
        },
        getCommunitiesInMulti: function(multiName){
            if(ProfileDB.SavedMultis[multiName])
                return ProfileDB.SavedMultis[multiName];
            else
                return false;
        },
        communityIsSaved: function(communityName){
            communityName = communityName.toLowerCase();
            var index = ProfileDB.SavedMultis['all'].indexOf(communityName);
            if(index !== -1) 
                return true;
            
            return false;
        },
        multiIsSaved: function(multiName){
            if(Object.keys(ProfileDB.SavedMultis).indexOf(multiName) > -1) 
                return true;
            
            return false;
        },
        addCommunity: function(communityName,multiName){
            communityName = communityName.toLowerCase();
            if(multiName && communityName && ProfileDB.SavedMultis[multiName]){
                if(multiName == 'all'){
                    //If communityName does not exist in 'all' it does not exist in any multi so we can just add it
                    if(ProfileDB.SavedMultis['all'].indexOf(communityName) == -1){
                        ProfileDB.SavedMultis['all'].push(communityName);
                        console.log("Added " + communityName + " to 'all'");
                        
                        if(ProfileDB.SavedMultis['ungrouped'].indexOf(communityName) == -1){
                            ProfileDB.SavedMultis['ungrouped'].push(communityName);
                            console.log("Added " + communityName + " to ungrouped");
                        }
                    } else {
                        //if it does exist in 'all' do nothing
                    }
                } else if(multiName == 'ungrouped'){
                    //cannot add to 'ungrouped'
                } else {
                    if(ProfileDB.SavedMultis[multiName].indexOf(communityName) == -1){
                        ProfileDB.SavedMultis[multiName].push(communityName);
                        console.log("Added " + communityName + " to " + multiName);
                    }
                    
                    if(ProfileDB.SavedMultis['all'].indexOf(communityName) == -1){
                        ProfileDB.SavedMultis['all'].push(communityName);
                        console.log("Added " + communityName + " to 'all'");
                    }
                    
                    var index = ProfileDB.SavedMultis['ungrouped'].indexOf(communityName);
                    if(index !== -1){
                        ProfileDB.SavedMultis['ungrouped'].splice(index,1);
                        console.log("Removed " + communityName + " from 'ungrouped'");
                    }
                }
            }
            
            saveProfileDB();
        },
        createMulti: function(multiName){
            multiName = multiName.toLowerCase();
            if(multiName){
                multiName = multiName.toLowerCase();
                if(!ProfileDB.SavedMultis[multiName]){
                    ProfileDB.SavedMultis[multiName] = [];
                    service.addCommunity(multiName, multiName);
                }
                
                saveProfileDB();
            }
        },
        removeCommunity: function(communityName, multiName){
            console.log('trying to remove ' + communityName + " from " + multiName);
            if(multiName && communityName){
                multiName = multiName.toLocaleLowerCase();
                communityName = communityName.toLocaleLowerCase();
                
                if(multiName == 'all'){
                    //Todo:
                    //need to remove from all multis
                } else if (multiName === 'ungrouped') {
                    //delete from all and ungrouped
                    var index = ProfileDB.SavedMultis['ungrouped'].indexOf(communityName);
                    if(index !== -1){
                        ProfileDB.SavedMultis['ungrouped'].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + 'ungrouped');
                    }

                    index = ProfileDB.SavedMultis['all'].indexOf(communityName);
                    if(index !== -1){
                        ProfileDB.SavedMultis['all'].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + 'all');
                        
                        saveProfileDB();
                        return true;
                    }
                } else {
                    //delete communityName in multiName
                    var index = ProfileDB.SavedMultis[multiName].indexOf(communityName);
                    if(index !== -1){
                        ProfileDB.SavedMultis[multiName].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + multiName);
                    
                        var exists = false;
                        for(var multi in ProfileDB.SavedMultis){
                            if(multi !== "all" && multi !== "ungrouped"){
                                console.log("Searching for " + communityName + " in " + multi);
                                if(ProfileDB.SavedMultis[multi].indexOf(communityName) !== -1){
                                    exists = true;
                                    console.log(communityName + ' exists in ' + multi);
                                    break;
                                }
                            }
                        }

                        //if comunity does not exists in any other multis
                        if(!exists){
                            ProfileDB.SavedMultis['ungrouped'].push(communityName);
                            console.log("Added " + communityName + " to 'ungrouped'");
                        }
                        
                        saveProfileDB();
                        return true;
                    }
                }
            }
            
            return false;
        },
        deleteMulti: function(multiName){
            multiName = multiName.toLowerCase();
            if(multiName && ProfileDB.SavedMultis[multiName] && multiName !== 'all' && multiName !== 'ungrouped'){
                var communities = ProfileDB.SavedMultis[multiName];
                console.log(communities);
                for(var index = 0; index < communities.length; index++){
                    console.log(communities[index]);
                    if(service.removeCommunity(communities[index],multiName)){
                        index--;
                    }
                }
                
                delete ProfileDB.SavedMultis[multiName];
                console.log("Deleted Multi: " + multiName);

                saveProfileDB();
            }
        },
        getUser: function(account){
            touchUser(account);
            
            return ProfileDB.users[account];
        },
        upvote: function(community,account,txHash){
            //console.log('Voting',community,account,txHash);
            touchPostScore(community,txHash);
            
            upvoteUser(account,txHash);
            saveProfileDB();
        },
        downvote: function(community,account,txHash){
            //console.log('voted!',community,account,txHash);
            touchPostScore(community,txHash);
            
            downvoteUser(account,txHash);
            saveProfileDB();
        },
        hasVoted: function(account,txHash){
            touchUser(account);
            //console.log(account,txHash);
            if(ProfileDB.users[account].upvotes.indexOf(txHash) !== -1){
                //console.log(txHash + " has voted.");
                return true;
            }
            
            if(ProfileDB.users[account].downvotes.indexOf(txHash) !== -1){
                //console.log(txHash + " has voted.");
                return true;
            }
            //console.log(txHash + " has not voted.");
            
            return false;
        },
        saveToFavorites: function(community,txHash){
            touchFavorite(community);
            
            saveFavorite(community,txHash);
            saveProfileDB();
        },
        removeFromFavorites: function(community,txHash){
            touchFavorite(community);
            
            removeFavorite(community,txHash);
            saveProfileDB();
        },
        isFavorited: function(community,txHash){
            touchFavorite(community);
            
            if(ProfileDB.favorited[community].indexOf(txHash) !== -1)
                return true;
            else
                return false;
        },
        getFavorites: function(community){
            touchFavorite(community);
            
            return ProfileDB.favorited[community];
        }
	};

	return service;
}]);