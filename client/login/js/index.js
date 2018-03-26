/*global $*/

var app = angular.module('_app', ["ngRoute"]);

app.run(function($rootScope) {
   $rootScope.message = {title: "", body: "", type: ""}
});
/*
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
*/

function authenticateForm($scope, $rootScope, $http, newAccount) {
    console.log('Hello there!')
    var loc = 'authenticate'
    if (newAccount) {
        loc = 'register'
    }
    var dat = JSON.stringify({"u": $scope.username, "p": $scope.password, "n": $scope.nick, cl: $scope.cl})
    console.log($scope.username)
    console.log($scope.cl)
    $scope.buttonText = 'Loading...'
    $http({
        method: 'POST',
        url: loc,
        data: dat,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    })
    .then(function successCB(data) {
        switch(data.data) {
            case "loggedin":
                window.location.assign('https://clubs-sbojevets.c9users.io/app');
                return false;
                //swalAlert($rootScope, "Success!", "Operation complete \n \n", "success", 3500);
                break;
            case 'registered':
                swalAlert($rootScope, "Welcome!", "Account created \n \n", "success", 3500);
                window.location.assign('https://clubs-sbojevets.c9users.io/#/login')
                $scope.username = ""
                $scope.password = ""
                break;
        }
    }, function errorCB(data) {
        console.log(data.data.msg)
        $scope.buttonText = 'Retry'
        switch(data.data.msg) {
            case 'auth/email-already-exists':
                swalAlert($rootScope, "Oops!", "That email is already in use! \n \n", "error", 3500);
                break;
            case 'auth/invalid-email':
                swalAlert($rootScope, "Uh oh!", "Invalid email, try another one! \n \n", "error", 3500);
                break;
            case 'auth/weak-password':
                swalAlert($rootScope, "Sorry!", "Password must be at least 6 characters long \n \n", "warning", 3500);
                break;
            case 'auth/user-not-found':
                swalAlert($rootScope, "Hmmm...", "No such user exists! \n \n", "error", 3500);
                break;
            case 'empty':
                swalAlert($rootScope, "Oops!", "No empty fields allowed. \n \n", "warning", 3500);
                break;
            case 'illegal':
                swalAlert($rootScope, "Sorry!", "No special characters allowed. \n \n", "warning", 3500);
                break;
            case 'auth/invalid-password':
                swalAlert($rootScope, "Aw!", "Invalid password, 8 characters required. \n \n", "error", 3500);
                break;
            case 'auth/wrong-password':
                swalAlert($rootScope, "Sorry!", "Incorrect username or password \n \n", "error", 3500);
                break;
            default:
                swalAlert($rootScope, "Sorry!", data.data.msg + " \n \n", "warning", "forever");
                break;
        }
    });
}


app.controller('mainFrame', function($scope, $rootScope, $http) {
  $scope.cl
  $scope.login = function() {
    authenticateForm($scope, $rootScope, $http, false)
  }
  $scope.signup = function() {
    $('#signupModal').modal({
        allowMultiple:false,
        centered:true,
        blurring:true,
    }).modal('show')
  }
})

app.controller('signup', function($scope, $rootScope, $http) {
    $scope.cl
    $scope.selectClass = function(index) {
        console.log('hi')
        $scope.cl = index
    }
    $scope.isActive = function(index) {
        if (index == $scope.cl) {
            return "active"
        }
        return ""
    }
    $scope.register = function() {
        authenticateForm($scope, $rootScope, $http, true)
    }
})


var lFollowX = 0,
    lFollowY = 0,
    x = 0,
    y = 0,
    friction = 1 / 30;

var translate;
function moveBackground() {
  x += (lFollowX - x) * friction;
  y += (lFollowY - y) * friction;
  
  translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

  $('#bgImage').css({
    '-webit-transform': translate,
    '-moz-transform': translate,
    'transform': translate
  });

  window.requestAnimationFrame(moveBackground);
}

$(window).on('mousemove click', function(e) {

  var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
  var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
  lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
  lFollowY = (10 * lMouseY) / 100;

});

moveBackground();



function swalAlert($rootScope, title, body, type, dur) {
    $rootScope.message.title = title
    $rootScope.message.body = body
    $rootScope.message.type = type
    $('#messageModal').modal({
        allowMultiple: false,
        blurring:true
    }).modal('show')
    /*
    clearTimeout(alertime);
    alertime = setTimeout(function() {
        if (dur == "forever") {
          swal({   
            title: title,   
            text: "<span style='color:white!important'>" + body + "</span",
            html:true,
            allowOutsideClick: true,
            type: type,   
            showCloseButton: true,
            showConfirmButton: false, 
            background: "transparent",
          });
        }
        else {
          swal({   
            title: title,   
            text: body,
            allowOutsideClick: true,
            type: type,
            timer: dur,   
            showCloseButton: true,
            showConfirmButton: false, 
            background: "transparent",
          });
        }
    }, 300);
    */
    
}
var alertime;