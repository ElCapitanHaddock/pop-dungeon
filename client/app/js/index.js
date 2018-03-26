//APP
/*global app*/

/* swalAlert unneeded now
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
*/


app.controller('mainFrame', function($rootScope, $scope) {
  $scope.filter = "today"
  $scope.filterActive = function(name) { //for filtering events by day/week/month
    if ($scope.filter == name) {
      return "active"
    }
    return "inactive"
  }
  $scope.setFilter = function(name) {
    $scope.filter = name;
  }
  
})

$('.ui.dropdown')
  .dropdown();

$('.ui.accordion')
  .accordion();
  
$('.menu .item')
  .tab();

$('.image .dimming')
  .dimmer({
    on: 'hover'
  })
;


function aoIndex(a, t, p) { //object-array term search
  for (var i = 0, len = a.length; i < len; i++) {
      if (a[i][p] === t) return i;
  }
  return -1;
}
