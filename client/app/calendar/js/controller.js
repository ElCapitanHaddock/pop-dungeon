/*global app*/


app.controller('CalendarCtrl',
  function($rootScope, $scope, $compile, $http, $timeout) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    $scope.onEventClick = function( date, jsEvent, view){
        date.modalName = "eventModal"
        $rootScope.modals.event(date)
    };
    
     $scope.onDrop = function(event, delta, revertFunc, jsEvent, ui, view){
    };
    
    $scope.onResize = function(event, delta, revertFunc, jsEvent, ui, view ){
      
    };
    
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    
    $scope.addEvent = function(opt) {
      $scope.events.push(opt);
    };
    
    $scope.addClubEvents = function(club) {
      for (var i = 0; i < club.events.length; i++) {
        club.events[i].color = club.color
        club.events[i].ribbon = "ui event c" + club.color +  " circular label"
        club.events[i].clubInitial = club.name.slice(0, 1)
        club.events[i].club = club.name
        club.events[i].clubid = club.id
        club.events[i].stick = true
        
        var s = new Date(club.events[i].start)
        s.setDate(s.getDate() + 1)
        club.events[i].month = s.getMonth()
        club.events[i].monthName = $rootScope.monthNames[s.getMonth()]
        club.events[i].week = s.getWeekOfMonth()
        club.events[i].day = s.getDate()
        club.events[i].year = s.getYear()
        
        $scope.addEvent(club.events[i])
      }
    }
    
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    
    $scope.changeView = function(view,calendar) {
      $('#myCalendar').fullCalendar('changeView',view);
    };
    
    $scope.renderCalendar = function(calendar) {
      $('#myCalendar').fullCalendar('renderEvents');
    };
    
    $scope.loadClubEvents = function() { //load events from each club into
      var list = $rootScope.clubs
      for (var i = 0; i < list.length; i++) {
          $http(
              {
              method: "GET",
              url: "/app/events/" + list[i].id
          }).then(function(res) {
            $scope.addClubEvents(res.data)
          }, function(err) {
            console.error(err)
          })
      }
    }
    
    $scope.viewRender = function(view, element) {
      //$rootScope.thisMonth = new Date(view.start).getMonth() + 1
    }
    
    $scope.uiConfig = {
      calendar:{
        editable: false, //EDITABLE
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.onEventClick,
        eventDrop: $scope.onDrop,
        eventResize: $scope.onResize,
        viewRender: $scope.viewRender
      }
    };
    
    $scope.events = [];
    $scope.eventSources = [$scope.events];
    $scope.loadClubEvents()
});