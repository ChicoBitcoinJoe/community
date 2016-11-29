Community.service('UserDB',[function(){
    console.log('Loading UserDB');
    var UserDB = null;
    
    var saveUserDB = function(){
        localStorage.setItem("UserDB",JSON.stringify(UserDB));
    };
    
    var loadProfile = function(account){
       return );
    };
    
    console.log(Web3Service.getCurrentAccount());
    UserDB = JSON.parse(localStorage.getItem("UserDB"));
    if(!UserDB){
        console.log('Could not find UserDB. Starting new database.');
        UserDB = {
        /*  user:{
                score:0,
                upvotes:[],
                downvotes:[],
                upvoteStreak:0;
                downvoteStreak:0;
            }*/        
        };

        saveUserDB();
    }
        
    var touchUser = function(user){
        if(!ProfileDB.users[user]){
            ProfileDB.users[user] = {};
            ProfileDB.users[user].score = 50;
            ProfileDB.users[user].upvotes = [];
            ProfileDB.users[user].downvotes = [];
            ProfileDB.users[user].upvoteStreak = 0;
            ProfileDB.users[user].downvoteStreak = 0;
        }
    };
    
    var service = {
        getUser: function(user){
            touchUser(user);
            return UserDB[user];
        }
	};

	return service;
}]);