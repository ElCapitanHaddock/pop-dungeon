

var request = require('request')

//example credidentials
//2@2.com
//1234

const src = "https://clubsapp-backend.herokuapp.com"

var API = function() {
    var self = this;
    
    self.authenticate = function(opts, cb) { //attempt login
        request({
            method: 'POST',
            url: src + '/api/login',
            json: opts
        },
        function (error, res, body) {
            return cb(Number(body.status), body["X-AUTH-TOKEN"])
        })
    }
    
    self.register = function(opts, cb) { //register user
        request({
            method: 'POST',
            url: src + '/api/register',
            json: opts
        },
        function (error, res, body) {
            if (body.errors) {
                if (body.errors.indexOf('password too short') !== -1) { //tbd, ask jevin to use 411
                    body.status = "411"
                }
            }
            return cb(Number(body.status), body)
        })
    }
    
    self.getDashboard = function(token, cb) { //send token to backend, recieve dashboard (tbd)
        request({
            method: 'GET',
            url: src + '/api/dashboard',
            json: token
        },
        function (error, res, body) {
            return cb(Number(body.status), body)
        })
    }
    
    self.getEvents = function(token, clubID, cb) {
        request({
            method: 'GET',
            url: src + '/api/club/events/',
            json: {token: token, clubID: clubID}
        },
        function (error, res, body) {
            return cb(Number(body.status), body)
        })
    }
    
    self.getEventInfo = function(token, clubID, eventID, cb) { //get calendar events from user by date (tbd)
        request({
            method: 'GET',
            url: src + '/api/club/eventInfo/',
            json: {token: token, clubID: clubID, eventID: eventID}
        },
        function (error, res, body) {
            return cb(Number(body.status), body)
        })
    }
}

/*todo: 
    documentation
    verification/certification through rotating encryption key
*/

/*
//TEST CASE
var user = new API();
user.authenticate({email:"2@2.com", password:"1234"}, function(status, token) {
    console.log(status + ": " + token)  
})
*/

module.exports = API;
