//APP

var app = angular.module('_app', ["ngRoute", "ui.calendar"]);

app.run(function($rootScope) {
    $rootScope.title = "dashboard";
});

function swalAlert(title, body, type, dur) {
    clearTimeout(alertime);
    alertime = setTimeout(function() {
        if (dur == "forever") {
          swal({   
            title: title,   
            text: body,
            allowOutsideClick: true,
            type: type,   
            showConfirmButton: false 
          });
        }
        else {
          swal({   
            title: title,   
            text: body,
            allowOutsideClick: true,
            type: type,
            timer: dur,   
            showConfirmButton: false 
          });
        }
    }, 300);
}
var alertime;

function toggleSidebar() {
  $('.ui.sidebar')
  .sidebar('setting', 'transition', 'overlay')
  .sidebar('toggle')
}

function goToCalendar() {
  $('#directives-calendar').toggle(true)
  $('#club-container').toggle(false)
}

function openClub(name) {
  $('#directives-calendar').toggle(false)
  $('#club-container').toggle(true)
  toggleSidebar()
  console.log(name)
}

function logOut() {
  removeCookieAuth();
  window.location.assign('https://clubs-sbojevets.c9users.io/');
}

function removeCookieAuth() {
    $.ajax({
      method: "POST",
      url: "/app/logout",
      cache: false,
      success: function(){
        console.log("logged out!")
      }
    });
}

function loadClubList(list) { //load sidebar list
    for (var i in list) {
        var club = list[i]
        /* old (cards)
        var content = "<div class='orange card'><div class='blurring dimmable image'><div class='ui inverted dimmer'><div class='content'><div class='center'><div class='ui primary button'>Add</div></div></div></div>"
        + "<img src='"
        + club.icon
        + "'></img></div>"
		+ "<div class='content'><a class='header'>"
		+ club.name
		+ "</a><div class='meta'><span class='description'>"
		+ club.short
		+ "</span></div></div><div class='extra content'><a><i class='users icon'></i>"
		+ club.members + " members"
		+ "</a></div></div>"
		*/
		var content = "<div class='item clubBtn' onclick='openClub(\"" + list[i].name + "\")'>"
		+"<img class='ui avatar image' src='"
		+ club.icon
	    +"'></img><div class='content'><a class='header'>"
	    + club.name
	    +"</a>"
	    + club.members + " members"
	    +"</div></div>"
        cl.append(content)
    }
}

function loadClubEvents(list, $scope) { //load events from each club into
  var tot = []
  for (var i = 0; i < list.length - 1; i++) {
    $.ajax(
        {
        method: "GET",
        url: "/app/events/" + i,
        cache: false,
        success: function(res) { //pass events
            tot = tot.concat(res)
        }
    })
  }
  $.ajax(
      {
      method: "GET",
      url: "/app/events/" + list.length - 1,
      cache: false,
      success: function(res) { //pass events
          tot = tot.concat(res)
          $scope.addEventCustom(tot)
      }
  })
}



