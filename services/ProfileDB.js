Community.service( 'ProfileDB',['$q','$window', function (LinkDB,$q,$window) {
    console.log('Loading ProfileDB account ');
    var ProfileDB = null;
    
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    var currentAccount = web3.eth.accounts[0];
    var accountInterval = setInterval(function() {
        if (typeof web3 === 'undefined') {
            console.log("set web3");
            web3 = new Web3(web3.currentProvider);
        }
        
        if (web3.eth.accounts[0] !== currentAccount)
            $window.location.reload();
    }, 100);
    
    var saveProfile = function(){
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
                'all':['cats','dogs','horses','bitcoin','ethereum','monero','politics'],
                'cryptocurrencies':['cats','bitcoin','ethereum','monero'],
                'animals':['cats','dogs','horses'],
                'ungrouped':['politics']
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
            WebOfTrust:{
                primary:[],
                secondary:[],
                banned:[]
            },
            AutoModerator:{
                users:{
                /*  user:{
                        conformist:{posts: []},
                        contrarian:{posts: []},
                        spam:{posts: []},
                        troll:{posts: []}
                    }*/        
                }
            }
        };
        
        saveProfile();
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
            return ProfileDB.SavedMultis[multiName];
        },
        addCommunity: function(communityName,multiName){
            if(multiName && communityName){
                //If communityName does not exist in 'all' it does not exist in any multi so we can just add it
                if(ProfileDB.SavedMultis['all'].indexOf(communityName) == "-1"){
                    ProfileDB.SavedMultis['all'].push(communityName);
                    console.log("Added " + communityName + " to 'all'");
                    
                    ProfileDB.SavedMultis[multiName].push(communityName);
                    console.log("Added " + communityName + " to " + multiName);
                } else {
                    if(multiName == 'ungrouped'){
                        if(ProfileDB.SavedMultis['ungrouped'].indexOf(communityName) == "-1"){
                            ProfileDB.SavedMultis['ungrouped'].push(communityName);
                            console.log("Added " + communityName + " to 'ungrouped'");    
                        }
                    } else {
                        if(ProfileDB.SavedMultis[multiName].indexOf(communityName) == "-1"){
                            ProfileDB.SavedMultis[multiName].push(communityName);
                            console.log("Added " + communityName + " to " + multiName);
                        }
                    }
                }
            }
            
            saveProfile();
        },
        createMulti: function(multiName){
            if(multiName){
                multiName = multiName.toLowerCase();
                if(!ProfileDB.SavedMultis[multiName]){
                    ProfileDB.SavedMultis[multiName] = [];
                    service.addCommunity(multiName, multiName);
                }
                
                saveProfile();
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
                                }
                            }
                        }

                        //if comunity does not exists in any other multis
                        if(!exists){
                            ProfileDB.SavedMultis['ungrouped'].push(communityName);
                            console.log("Added " + communityName + " to 'ungrouped'");
                        }
                        
                        return true;
                    }
                }
                
                saveProfile();
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
                console.log("Deleted Multi" + multiName);

                saveProfile();
            }
        }
	};

	return service;
}]);