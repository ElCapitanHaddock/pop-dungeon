/*global app*/
//LOGIN

app.config(function($routeProvider) {
    $routeProvider
    .when("/main", {
        templateUrl : "./views/main.html",
		controller: "mainCtrl"
    })
    .when("/login", {
        templateUrl : "./views/login.html",
		controller: "loginCtrl"
    })
    .when("/signup", {
        templateUrl : "./views/signup.html",
		controller: "signupCtrl"
    })
    .otherwise({
        templateUrl : "./views/login.html",
		controller: "loginCtrl"
    })
});