/*global app*/
/*global $*/

//main controller
app.controller('pageCtrl', function($rootScope, $scope, $route, $http) {
    $scope.posts = []
    
    window.addEventListener("resize", function() {
        $scope.maxMonstChar = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 100;
    });
    
    /*
    $scope.loadClubEvents = function() { //load events from each club into
      $http(
          {
          method: "GET",
          url: "/app/events/" + $rootScope.club.id
      }).then(function(res) {
          var club = res.data
          var events = res.data.events
          for (var i = 0; i < events.length; i++) {
                events[i].color = club.color
                events[i].clubInitial = club.name.slice(0, 1)
                events[i].club = club.name
                events[i].stick = true
                
                var s = new Date(events[i].start)
                s.setDate(s.getDate() + 1)
                events[i].month = s.getMonth()
                events[i].monthName = $rootScope.monthNames[s.getMonth()]
                events[i].week = s.getWeekOfMonth()
                events[i].day = s.getDate()
                events[i].year = s.getYear()
          }
          $scope.posts = events
      }, function(err) {
        console.error(err)
      })
    }
    */
    $scope.loadMonsters = function() {
      $http(
          {
          method: "GET",
          url: "/app/monsters/" + $rootScope.club.id
      }).then(function(res) {
            $rootScope.monsters = res.data;
      }, function(err) {
        console.error(err)
      })
    }
    
    $rootScope.init = function() {
      //$scope.loadClubEvents()
      $scope.loadMonsters()
    }
    $scope.$on('reloadPage', function() {
        $rootScope.init()
        $('.ui.dropdown')
        .dropdown();
    })
    
    //GAME
    $scope.openGame = function(index) {
      $rootScope.currentMonster = index
      $rootScope.modals.game({
        modalName: "GAME_CONTAINER",
        name: $rootScope.monsters[$rootScope.currentMonster].name,
        type: "Monster Hunt"
      });
      $rootScope.reloadGame()
    }
})

app.controller('tavernCtrl', function($rootScope, $scope, $route, $http) {
})

app.controller('homeCtrl', function($rootScope, $scope, $route, $http) {
})

app.controller('heroCtrl', function($rootScope, $scope, $route, $http) {
})

app.controller('leaderboardCtrl', function($rootScope, $scope, $route, $http) {
})

