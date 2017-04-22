/*global $*/



/*
todo:
deselect hours to reset filter
have default hour selection be "all"
*/



//club list
var cl = $("#clubList");

//previous date info object, used to check degree of time change (is it actual date or just hours?)
var last; 

function init($scope) {
    $.ajax(
        {
        method: "GET",
        url: "/app/dashboard",
        cache: false,
        success: function(data) { //passes clubs and calendar settings
            loadClubList(data.clubs)
            loadClubEvents(data.clubs, $scope)
        }
    });
}
