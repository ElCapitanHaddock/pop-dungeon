/*global app*/

app.controller('center', function($scope, $rootScope) {
    
});

app.controller('submitCreds', function($scope, $rootScope, $http) {
    $scope.submit = function() {
        if ($rootScope.title === "login") {
            authenticateForm($scope, $http, false)
        }
        else if ($rootScope.title === "sign up") {
            authenticateForm($scope, $http, true)
        }
    }
});

var selectedStyle = {"color":"#47a9ff"}
var unselectedStyle = {}

app.controller('mainCtrl', function($scope, $rootScope) {
    $rootScope.mainSt = selectedStyle
    $rootScope.loginSt = unselectedStyle
    $rootScope.signupSt = unselectedStyle
    $rootScope.title = "about"
});
app.controller('loginCtrl', function($scope, $rootScope) {
    $rootScope.mainSt = unselectedStyle
    $rootScope.loginSt = selectedStyle
    $rootScope.signupSt = unselectedStyle
    $rootScope.title = "login"
    $scope.buttonText = 'login'
});
app.controller('signupCtrl', function($scope, $rootScope) {
    $rootScope.mainSt = unselectedStyle
    $rootScope.signupSt = selectedStyle
    $rootScope.loginSt = unselectedStyle
    $rootScope.title = "sign up"
    $scope.buttonText = 'sign up'
});