Community.service('AutoModerator', ['ProfileDB', function (ProfileDB) {
	console.log('Loading AutoModerator');
    var AutoModerator = ProfileDB.getAutoModerator();
    
    var UserScoreAlgorithm = function(user){
        var conformist = AutoModerator.users[user].conformist.posts.length;
        var contrarian = AutoModerator.users[user].contrarian.posts.length;
        var spam = AutoModerator.users[user].spam.posts.length;
        var troll = AutoModerator.users[user].troll.posts.length;
        
        AutoModerator.users[user].score = conformist+contrarian-spam*.5-troll*2;
    }
    
	var service = {
		vote: function(user,txHash, option){
            if(!(user in AutoModerator.users)){
               AutoModerator.users[user] = {
                    score:0,
                    honest:{posts: []},
                    dishonest:{posts: []},
                          spam:{posts: []},
                         troll:{posts: []}
                }
            }
            
            if(option === 'honest'){
                if(AutoModerator.users[user].conformist.posts.indexOf(txHash) == -1)
                    AutoModerator.users[user].conformist.posts.push(txHash);
            } else if(option === 'dishonest'){
                if(AutoModerator.users[user].contrarian.posts.indexOf(txHash) == -1)
                    AutoModerator.users[user].contrarian.posts.push(txHash);
            } else if(option === 'muted'){
                if(AutoModerator.users[user].troll.posts.indexOf(txHash) == -1)
                    AutoModerator.users[user].troll.posts.push(txHash);
            }
            
            UserScoreAlgorithm(user);
            ProfileDB.saveAutoModerator(AutoModerator);
        },
        hasUserVoted: function(user,txHash){
            if(user in AutoModerator.users){
                var exists = false;
                if(AutoModerator.users[user].conformist.posts.indexOf(txHash) != -1)
                    exists = true;
                if(AutoModerator.users[user].contrarian.posts.indexOf(txHash) != -1)
                    exists = true;
                if(AutoModerator.users[user].spam.posts.indexOf(txHash) != -1)
                    exists = true;
                if(AutoModerator.users[user].troll.posts.indexOf(txHash) != -1)
                    exists = true;
                
                return exists;
            } else {
                return false;
            }
        },
        getUser(user){
            if(user in AutoModerator.users){
                return AutoModerator.users[user];
            } else {
                return null;
            }
        },
        getPostScore(txHash){
            return 10;
        }
	};

	return service;
}]);