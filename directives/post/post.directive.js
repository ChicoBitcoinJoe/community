app.directive('post', ['$ipfs','$q','$web3','$location','NameService', function($ipfs, $q, $web3, $location, Names) {
	return {
		restrict: 'E',
		replace: false,
		templateUrl: 'directives/post/post.directive.html',
		scope: {
			post: '=',
			fallbackGateway: '='
		},
		controller: function($scope){
			$scope.whois = Names.get;

			//console.log($scope.post);
			/*
			$ipfs.get($scope.post.hash, $scope.fallbackGateway)
			.then(function(data){
				//console.log(data);
				$scope.post.data = JSON.parse(data);

				var seconds = $scope.now() - $scope.post.timestamp;
				var minutes = Math.floor(seconds/60);
				var hours = Math.floor(minutes/60);
				var days = Math.floor(hours/24);

				var elapsed = seconds;
				var timeSpan = 'second';

				if(days > 0){
					timeSpan = 'day';
					elapsed = days;
				} else if(hours > 0){
					timeSpan = 'hour';
					elapsed = hours;
				} else if(minutes > 0){
					timeSpan = 'minute';
					elapsed = minutes;
				}
				
				var plural = '';
				if(elapsed > 1)
					plural = 's';
				$scope.timeElapsed = elapsed + ' ' + timeSpan + plural;
			}).catch(function(err){
				console.error(err);
			});
			*/

			function calculateElapsedTime(){
				var seconds = $scope.now() - $scope.post.timestamp;
				var minutes = Math.floor(seconds/60);
				var hours = Math.floor(minutes/60);
				var days = Math.floor(hours/24);
		
				var elapsed = seconds;
				var timeSpan = 'second';
		
				if(days > 0){
					timeSpan = 'day';
					elapsed = days;
				} else if(hours > 0){
					timeSpan = 'hour';
					elapsed = hours;
				} else if(minutes > 0){
					timeSpan = 'minute';
					elapsed = minutes;
				}
				
				var plural = '';
				if(elapsed > 1)
					plural = 's';
					
				$scope.timeElapsed = elapsed + ' ' + timeSpan + plural;
			};

			$scope.now = function(){
				return parseInt((Date.now() / 1000).toFixed(0));
			}
			
			$scope.goto = function(path){
				$location.path(path);
			}

			calculateElapsedTime();
		}
	}
}]);