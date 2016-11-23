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
    if(ProfileDB == null){
        console.log('Could not find a profile using default');
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
            AutoModerator:{
                users:{
                /*  user:{
                        score:0,
                        upvotes:[],
                        downvotes:[],
                        downvoteStreak:0
                    }*/        
                }
            }
        };

        saveProfileDB();
    }
    
    console.log("ProfileDB done loading");
    
    var createUserProfile = function(user){
        var keys = Object.keys(ProfileDB.AutoModerator.users);
        if(keys.indexOf(user) == '-1'){
            ProfileDB.AutoModerator.users[user] = {};
            ProfileDB.AutoModerator.users[user].upvotes = [];
            ProfileDB.AutoModerator.users[user].downvotes = [];
            ProfileDB.AutoModerator.users[user].downvoteStreak = 0;
            ProfileDB.AutoModerator.users[user].score = 0;
        }
    }
    
    var updateUserScore = function(user){
        var honest = ProfileDB.AutoModerator.users[user].upvotes.length;
        var dishonest = ProfileDB.AutoModerator.users[user].downvotes.length;
        
        var score = 100 + (honest - dishonest*2);
        
        ProfileDB.AutoModerator.users[user].score = score;
    }
    
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
            if(index != '-1') 
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
                    if(ProfileDB.SavedMultis['all'].indexOf(communityName) == "-1"){
                        ProfileDB.SavedMultis['all'].push(communityName);
                        console.log("Added " + communityName + " to 'all'");
                        
                        if(ProfileDB.SavedMultis['ungrouped'].indexOf(communityName) == "-1"){
                            ProfileDB.SavedMultis['ungrouped'].push(communityName);
                            console.log("Added " + communityName + " to ungrouped");
                        }
                    } else {
                        //if it does exist in 'all' do nothing
                    }
                } else if(multiName == 'ungrouped'){
                    //cannot add to 'ungrouped'
                } else {
                    if(ProfileDB.SavedMultis[multiName].indexOf(communityName) == "-1"){
                        ProfileDB.SavedMultis[multiName].push(communityName);
                        console.log("Added " + communityName + " to " + multiName);
                    }
                    
                    if(ProfileDB.SavedMultis['all'].indexOf(communityName) == "-1"){
                        ProfileDB.SavedMultis['all'].push(communityName);
                        console.log("Added " + communityName + " to 'all'");
                    }
                    
                    var index = ProfileDB.SavedMultis['ungrouped'].indexOf(communityName);
                    if(index != "-1"){
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
                    if(index != "-1"){
                        ProfileDB.SavedMultis['ungrouped'].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + 'ungrouped');
                    }

                    index = ProfileDB.SavedMultis['all'].indexOf(communityName);
                    if(index != "-1"){
                        ProfileDB.SavedMultis['all'].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + 'all');
                        
                        saveProfileDB();
                        return true;
                    }
                } else {
                    //delete communityName in multiName
                    var index = ProfileDB.SavedMultis[multiName].indexOf(communityName);
                    if(index != "-1"){
                        ProfileDB.SavedMultis[multiName].splice(index, 1);
                        console.log("Deleted " + communityName + " from " + multiName);
                    
                        var exists = false;
                        for(var multi in ProfileDB.SavedMultis){
                            if(multi !== "all" && multi !== "ungrouped"){
                                console.log("Searching for " + communityName + " in " + multi);
                                if(ProfileDB.SavedMultis[multi].indexOf(communityName) != "-1"){
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
            if(multiName && ProfileDB.SavedMultis[multiName] && multiName != 'all' && multiName != 'ungrouped'){
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
            createUserProfile(user);
            
            return ProfileDB.AutoModerator.users[user].score;
        },
        upvote: function(user,ipfsHash){
            createUserProfile(user);
            console.log(ProfileDB.AutoModerator.users[user].downvotes);
            var index = ProfileDB.AutoModerator.users[user].downvotes.indexOf(ipfsHash);
            if(index !== '-1')
                ProfileDB.AutoModerator.users[user].downvotes.splice(index,1);
            console.log(ProfileDB.AutoModerator.users[user].downvotes);
            if(ProfileDB.AutoModerator.users[user].upvotes.indexOf(ipfsHash) == '-1')
               ProfileDB.AutoModerator.users[user].upvotes.push(ipfsHash);
            console.log(ProfileDB.AutoModerator.users[user].upvotes);
            updateUserScore(user);
            saveProfileDB();
        },
        downvote: function(user,ipfsHash){
            createUserProfile(user);
            console.log(ProfileDB.AutoModerator.users[user].upvotes);
            var index = ProfileDB.AutoModerator.users[user].upvotes.indexOf(ipfsHash);
            if(index !== '-1')
                ProfileDB.AutoModerator.users[user].upvotes.splice(index,1);
            console.log(ProfileDB.AutoModerator.users[user].upvotes);
            if(ProfileDB.AutoModerator.users[user].downvotes.indexOf(ipfsHash) == '-1')
               ProfileDB.AutoModerator.users[user].downvotes.push(ipfsHash);
            console.log(ProfileDB.AutoModerator.users[user].downvotes);
            updateUserScore(user);
            saveProfileDB();
        },
        hasVoted: function(user,ipfsHash){
            createUserProfile(user);
            
            var index = ProfileDB.AutoModerator.users[user].upvotes.indexOf(ipfsHash);
            if(index !== -1)
                return 'honest'; 
               
            var index2 = ProfileDB.AutoModerator.users[user].downvotes.indexOf(ipfsHash);
            if(index2 !== -1)
                return 'dishonest'; 
            
            return false;
        },
        getPostScore: function(){
            var score = 0;
            return score;
        }
	};

	return service;
}]);