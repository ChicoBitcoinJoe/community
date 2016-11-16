Community.service( 'ProfileDB',['Community', function (Community) {
    console.log('Loading ProfileDB account ');
    var ProfileDB = null;
    var currentAccount;
    
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
        currentAccount = web3.eth.accounts[0];
        localStorage.setItem('ProfileDB.lastUsedAccount',currentAccount);
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        currentAccount = localStorage.getItem('ProfileDB.lastUsedAccount');
    }

    var saveProfileDB = function(){
        if(web3.eth.accounts[0] !== undefined)
            localStorage.setItem(web3.eth.accounts[0],JSON.stringify(ProfileDB));
    };
    
    var loadProfile = function(account){
       return JSON.parse(localStorage.getItem(account));
    };
    
    ProfileDB = loadProfile(web3.eth.accounts[0]);
    if(ProfileDB == null){
        console.log('Could not find a profile using default');
        ProfileDB = {
            SavedMultis:{
                'all':['community','cats','dogs','horses','bitcoin','ethereum','monero','politics'],
                'cryptocurrencies':['bitcoin','ethereum','monero'],
                'animals':['cats','dogs','horses'],
                'ungrouped':['community','politics']
            },
            SavedPosts:{
            /*  community:{
                    posts:{
                        'QmdpL1cf2ti3m98tvEc5NPZuQbZQjreiXbTVWsf3TvMMJS':{
                            comments:[QmgkL15f2Ci3D98nvE25N1ZuQAZQjr6iXbTVWsf3TvMMpq,...],
                        },
                        'Qm7kL1qf2zi3g983vE95NjZuQtZQjTeeXbTVgsf4T4M4Eb':{
                            comments:[]
                        }
                    },
                }//*/
            },
            SavedComments:{
            /*  community:{
                    comments:{
                        'QmgkL15f2Ci3D98nvE25N1ZuQAZQjr6iXbTVWsf3TvMMpq':{
                            comments:[]
                        }
                    }
                },//*/
            },
            AutoModerator:{
                users:{
                /*  user:{
                        honestVotes:[];
                        dishonestVotes:[];
                    }*/        
                }
            }
        };
        
        saveProfileDB();
    }
    
    var createUserProfile = function(user){
        var keys = Object.keys(ProfileDB.AutoModerator.users);
        if(keys.indexOf(user) == '-1'){
            ProfileDB.AutoModerator.users[user] = {};
            ProfileDB.AutoModerator.users[user].honestVotes = [];
            ProfileDB.AutoModerator.users[user].dishonestVotes = [];
        }
    }
    
    var updateUserScore = function(user){
        var honest = ProfileDB.AutoModerator.users[user].honestVotes.length;
        var dishonest = ProfileDB.AutoModerator.users[user].dishonestVotes.length;
        
        var score = 50 + (honest - dishonest*2);
        if(score > 100)
            score = 100;
        if(score < 0)
            score = 0;
        
        ProfileDB.AutoModerator.users[user].score = score;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    
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
        honestVote: function(user,ipfsHash){
            createUserProfile(user);
            console.log(ProfileDB.AutoModerator.users[user].dishonestVotes);
            var index = ProfileDB.AutoModerator.users[user].dishonestVotes.indexOf(ipfsHash);
            if(index > -1)
                ProfileDB.AutoModerator.users[user].dishonestVotes.splice(index,1);
            console.log(ProfileDB.AutoModerator.users[user].dishonestVotes);
            if(ProfileDB.AutoModerator.users[user].honestVotes.indexOf(ipfsHash) == '-1')
               ProfileDB.AutoModerator.users[user].honestVotes.push(ipfsHash);
            
            updateUserScore(user);
            saveProfileDB();
        },
        dishonestVote: function(user,ipfsHash){
            createUserProfile(user);
            console.log(ProfileDB.AutoModerator.users[user].honestVotes);
            var index = ProfileDB.AutoModerator.users[user].honestVotes.indexOf(ipfsHash);
            if(index > -1)
                ProfileDB.AutoModerator.users[user].honestVotes.splice(index,1);
            console.log(ProfileDB.AutoModerator.users[user].honestVotes);
            if(ProfileDB.AutoModerator.users[user].dishonestVotes.indexOf(ipfsHash) == '-1')
               ProfileDB.AutoModerator.users[user].dishonestVotes.push(ipfsHash);
            
            updateUserScore(user);
            saveProfileDB();
        },
        hasVoted: function(user,ipfsHash){
            createUserProfile(user);
            
            var index = ProfileDB.AutoModerator.users[user].honestVotes.indexOf(ipfsHash);
            if(index !== -1)
                return 'honest'; 
               
            var index2 = ProfileDB.AutoModerator.users[user].dishonestVotes.indexOf(ipfsHash);
            if(index2 !== -1)
                return 'dishonest'; 
            
            return false;
        },
        getPostScore: function(community,ipfsHash){
            var posters = Community.getPosters(community,ipfsHash);
            
            var score;
            for(index in posters){
                score += service.getUserScore(posters[index]);
            }
            
            return score;
        }
	};

	return service;
}]);