/*global app*/
//CLUB

app.config(function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when("/:club/:clubid/:page", {
    })
    .when("/:club/:clubid", {
    })
});