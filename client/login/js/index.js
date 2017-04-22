//LOGIN

var app = angular.module('_app', ["ngRoute"]);

app.run(function($rootScope) {
   $rootScope.mainTx = "help_outline"
   $rootScope.loginTx = "input"
   $rootScope.signupTx = "person_add"
});

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

function authenticateForm($scope, $http, newAccount) {
    var loc = 'authenticate'
    if (newAccount) {
        loc = 'register'
    }
    var dat = JSON.stringify({"u": $scope.username, "p": $scope.password})
    $scope.buttonText = 'Loading...'
    $http({
        method: 'POST',
        url: loc,
        data: dat,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    })
    .success(function(data) {
        console.log(data)
        switch(data) {
            case "loggedin":
                window.location.assign('https://clubs-sbojevets.c9users.io/app');
                //swalAlert("Success!", "Operation complete \n \n", "success", 3750);
                break;
            case 'registered':
                swalAlert("Welcome!", "Account created \n \n", "success", 3750);
                window.location.assign('https://clubs-sbojevets.c9users.io/#/login')
                $scope.username = ""
                $scope.password = ""
                break;
        }
    })
    .error(function(data) {
        console.log(data)
        $scope.buttonText = 'Retry'
        switch(data) {
            case 'already':
                swalAlert("Sorry!", "That username already exists! \n \n", "error", 3750);
                break;
            case 'short':
                swalAlert("Sorry!", "Password must be at least 8 characters long \n \n", "warning", 3750);
                break;
            case 'nonexistant':
                swalAlert("Sorry!", "No such user exists! \n \n", "error", 3750);
                break;
            case 'empty':
                swalAlert("Sorry!", "No empty fields allowed. \n \n", "warning", 3750);
                break;
            case 'illegal':
                swalAlert("Sorry!", "No special characters allowed. \n \n", "warning", 3750);
                break;
            case 'incorrect':
                swalAlert("Sorry!", "Incorrect username or password \n \n", "error", 3750);
                break;
            case 'error':
                swalAlert("Sorry!", "Something went wrong! Check again later. \n \n", "warning", "forever");
                break;
        }
    });
}


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