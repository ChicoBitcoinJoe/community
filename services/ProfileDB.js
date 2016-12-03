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
    
    console.log(Web3Service.getCurrentAccount());
    ProfileDB = loadProfile(Web3Service.getCurrentAccount());
    if(!ProfileDB){
        console.log('Could not find a profile. Using default profile');
        ProfileDB = {
            SavedMultis:{
                'all':['community','bitcoin','ethereum','monero','politics'],
                'cryptocurrencies':['bitcoin','ethereum','monero'],
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
    
    console.log("ProfileDB done loading");
    
    var touchUser = function(user){
        if(!ProfileDB.users[user]){
            ProfileDB.users[user] = {};
            ProfileDB.users[user].upvotes = [];
            ProfileDB.users[user].downvotes = [];
            ProfileDB.users[user].upvoteStreak = 0;
            ProfileDB.users[user].downvoteStreak = 0;
            ProfileDB.users[user].score = 50;
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
        } else {
            //console.log("Score Detected", ProfileDB.PostScores[community]);
        }   
        
        //console.log(ProfileDB.PostScores[community].post[txHash]);
    };
    
    var updateUserScore = function(user){
        var upvoteStreak = ProfileDB.users[user].upvoteStreak;
        var downvoteStreak = ProfileDB.users[user].downvoteStreak;
        //console.log(upvoteStreak,downvoteStreak);
        
        var points = [0,1,1,2,3,5,8,13,21,34,55];
        ProfileDB.users[user].score += points[upvoteStreak];
        ProfileDB.users[user].score -= points[downvoteStreak];
        if(ProfileDB.users[user].score > 100)
            ProfileDB.users[user].score = 100;
        if(ProfileDB.users[user].score < 0)
            ProfileDB.users[user].score = 0;
    };
    
    var upvoteUser = function(user,txHash){
        touchUser(user);
        
        var upvoteStreak = ProfileDB.users[user].upvoteStreak;
        if(ProfileDB.users[user].upvotes.indexOf(txHash) == -1){
            ProfileDB.users[user].upvotes.push(txHash);
            ProfileDB.users[user].upvoteStreak = upvoteStreak + 1;
            ProfileDB.users[user].downvoteStreak = 0;
            
            if(ProfileDB.users[user].upvoteStreak > 10)
                ProfileDB.users[user].upvoteStreak = 10;
            
            updateUserScore(user);
        } else
            console.log('user voted already');
    };
    
    var downvoteUser = function(user,txHash){
        touchUser(user);
        
        var downvoteStreak = ProfileDB.users[user].downvoteStreak;
        if(ProfileDB.users[user].downvotes.indexOf(txHash) == -1){
            ProfileDB.users[user].downvotes.push(txHash);
            ProfileDB.users[user].upvoteStreak = 0;
            ProfileDB.users[user].downvoteStreak = downvoteStreak + 1;
            
            if(ProfileDB.users[user].downvoteStreak > 10)
                ProfileDB.users[user].downvoteStreak = 10;
            
            updateUserScore(user);
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
            if(index !== '-1') 
                return true;
            
            return false;
        },
        multiIsSaved: function(multiName){
            if(ProfileDB.SavedMultis[multiName])
                return true;
            
            return false;
        },
        addCommunity: function(communityName,multiName){
            communityName = communityName.toLowerCase();
            if(multiName && communityName && ProfileDB.SavedMultis[multiName]){
                if(multiName == 'all'){
                    //If communityName does not exist in 'all' it does not exist in any multi so we can just add it
                    if(ProfileDB.SavedMultis['all'].indexOf(communityName) == '-1'){
                        ProfileDB.SavedMultis['all'].push(communityName);
                        console.log("Added " + communityName + " to 'all'");
                        
                        if(ProfileDB.SavedMultis['ungrouped'].indexOf(communityName) == '-1'){
                            ProfileDB.SavedMultis['ungrouped'].push(communityName);
                            console.log("Added " + communityName + " to ungrouped");
                        }
                    } else {
                        //if it does exist in 'all' do nothing
                    }
                } else if(multiName == 'ungrouped'){
                    //cannot add to 'ungrouped'
                } else {
                    if(ProfileDB.SavedMultis[multiName].indexOf(communityName) == '-1'){
                        ProfileDB.SavedMultis[multiName].push(communityName);
                        console.log("Added " + communityName + " to " + multiName);
                    }
                    
                    if(ProfileDB.SavedMultis['all'].indexOf(communityName) == '-1'){
                        ProfileDB.SavedMultis['all'].push(communityName);
                        console.log("Added " + communityName + " to 'all'");
                    }
                    
                    var index = ProfileDB.SavedMultis['ungrouped'].indexOf(communityName);
                    if(index !== '-1'){
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
                
                if(multiName === 'all'){
                    //Ignore    
                } else if (multiName === 'ungrouped') {
                    //delete from all and ungrouped
                    var index = ProfileDB.SavedMultis['ungrouped'].indexOf(communityName);
                    if(index !== '-1'){
                        ProfileDB.SavedMultis['ungrouped'].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + 'ungrouped');
                    }

                    index = ProfileDB.SavedMultis['all'].indexOf(communityName);
                    if(index !== '-1'){
                        ProfileDB.SavedMultis['all'].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + 'all');
                        
                        saveProfileDB();
                        return true;
                    }
                } else {
                    //delete communityName in multiName
                    var index = ProfileDB.SavedMultis[multiName].indexOf(communityName);
                    if(index !== '-1'){
                        ProfileDB.SavedMultis[multiName].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + multiName);
                    
                        var exists = false;
                        for(var multi in ProfileDB.SavedMultis){
                            if(multi !== "all" && multi !== "ungrouped"){
                                console.log("Searching for " + communityName + " in " + multi);
                                if(ProfileDB.SavedMultis[multi].indexOf(communityName) !== '-1'){
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
        getUserScore: function(user){
            touchUser(user);
            
            return ProfileDB.users[user].score;
        },
        upvote: function(community,user,txHash){
            //console.log('Voting',community,user,txHash);
            touchPostScore(community,txHash);
            
            upvoteUser(user,txHash);
            saveProfileDB();
        },
        downvote: function(community,user,txHash){
            //console.log('voted!',community,user,txHash);
            touchPostScore(community,txHash);
            
            downvoteUser(user,txHash);
            saveProfileDB();
        },
        hasVoted: function(user,txHash){
            touchUser(user);
            //console.log(user,txHash);
            if(ProfileDB.users[user].upvotes.indexOf(txHash) !== -1){
                //console.log(txHash + " has voted.");
                return true;
            }
            
            if(ProfileDB.users[user].downvotes.indexOf(txHash) !== -1){
                //console.log(txHash + " has voted.");
                return true;
            }
            //console.log(txHash + " has not voted.");
            
            return false;
        },
        updatePostScore: function(community,txHash,posters){
            console.log(community,txHash,posters);
            touchPostScore(community,txHash);
            
            var score = 0;
            var relaventPosters = [];
            for(poster in posters){
                touchUser(posters[poster]);
                
                var userScore = ProfileDB.users[posters[poster]].score;
                var tolerance = 15; //AutoModerator.getScoreTolerance();
                if(userScore > tolerance){ //AutoModerator setting score tolerance
                    relaventPosters.push(posters[poster]);
                    score += userScore;
                }
            }
            
            
            score = Math.round(score/relaventPosters.length);
            console.log(score);
            ProfileDB.PostScores[community].post[txHash].score = score;
            ProfileDB.PostScores[community].post[txHash].posters = relaventPosters;
        },
        getPostScore: function(community,txHash){
            touchPostScore(community,txHash);
            return ProfileDB.PostScores[community].post[txHash];
        }
	};

	return service;
}]);