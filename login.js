
var express = require('express')
var path = require('path')
var Cryptr = require('cryptr')
var bcrypt = require('bcrypt')
var random = require('random-gen')
var should = require('should')

var Login = function(app, api, store) {
    var self = this
    var login = express()
    self.express = login
    
    /*
    _____________________________________________
    ________________L O G I N ___________________
    */
    
    login.post('/authenticate', function(req, res) {
        var data = req.body
        if (sanitary(data) && !empty(data)) {
            api.authenticate({email: data.u, password: data.p}, function(status, token) {
                if (status == 200) {
                    console.log('User ' + data.u + ' logged with ' + token + ' at ' + displayTime())
                    //add session id to database, paired with token
                    updateSession(req.session.id, token)
                    req.session.logged = true //need to "change" the session to bypass saveUninitialized
                    res.send('loggedin')
                    res.end()
                }
                else {
                    switch(status) {
                        case 404: //not found 
                            res.status(401).send('incorrect')
                            break;
                        case 401: //unauthorized
                            res.status(401).send('incorrect')
                            break;
                        case 400: //error
                            res.status(400).send('error')
                            break;
                        default:
                            res.status(503).send('error')
                            break;
                    }
                }
            })
        }
        else if (data.u === undefined || empty(data)) {
            res.status(400).send('empty')
            res.end()
        }
        else if (!sanitary(data)) {
            res.status(400).send('illegal')
            res.end()
        }
        else {
            res.status(400).send('error')
            res.end()
        }
    })
    
    
    
    //_______________REGISTER________________
    
    login.post('/register', function(req, res) {
        var data = req.body
        if (sanitary(data) && !empty(data)) {
            var username = data.u.substring(0, data.u.indexOf("@")) //the area before the @ is the username
            api.register({email: data.u, name: username, password: data.p}, function(status, info) {
                if (status == 200) {
                    console.log('User ' + data.u + ' registered at ' + displayTime())
                    console.log(info)
                    req.session.logged = true //"change" the session to bypass saveUninitialized
                    res.send('registered')
                    res.end()
                }
                else {
                    switch(status) {
                        case 411: //length too short
                            res.status(411).send('short')
                            break;
                        case 409: //user already exists, conflict
                            res.status(409).send('already')
                            break;
                        case 400: //error
                            res.status(400).send('error')
                            break;
                        default:
                            res.status(503).send('error')
                            break;
                    }
                }
            })
        }
        else if (data.u === undefined || empty(data)) {
            res.status(400).send('empty')
            res.end()
        }
        else if (!sanitary(data)) {
            res.status(400).send('illegal')
            res.end()
        }
        else {
            res.status(400).send('error')
            res.end()
        }
    })
    
    login.use(express.static(path.join(__dirname, 'client/login'))) //serve static files
    
    
    /*Updates the session<->token database when someone logs in:
    
        If a match already exists:
            Modify the first existing pair to the new token
            Delete the other matches (should never happen, only one token per session)
        If a match does not exist:
            Insert a new session/token pair into the database
            
    */
    function updateSession(id, token) {
        var session = {token: token, id: id}
        store.loadDatabase(function (err) {})
        store.find({id: id}, function(err, sessions) {
            if (!err) { //if not error
                if (sessions.length !== 0) { //if found
                    for (var i = 0; i < sessions.length; i++) {
                        if (sessions[i].token !== token) { //if session is assigned to another user, update it
                            if (i == 0) { //to ensure that only one copy exists, the rest (extras) deleted
                                store.update({ _id: sessions[i]._id }, session, {}, function (err, numReplaced) {
                                    if (err) console.error(err)
                                })
                                store.persistence.compactDatafile();
                            }
                            else { //delete extras
                                store.remove({ _id: sessions[i]._id }, {}, function (err, numRemoved) {
                                  if (err) console.log(err)
                                })
                            }
                        }
                    }
                } //if not found, add session
                else {
                    store.insert(session, function(err, newSession) {
                        if (err) { console.error(err) }
                    })
                }
            }
            else {
                console.error('error: session update')
            }
        })
    }
    
    
    
    
}

var illegal = !/[~`!#$%\^&*+=\-\[\]\\',/{}|\\":<>\?]/g;

function sanitary(data) {
    if (data === undefined) {
        return false
    }
    return should(data).be.ok() 
            && !(data.p === undefined || data.u === undefined)
            && data.should.not.match(illegal)
}

function empty(data) {
    return /^\s+$/.test(data.u) || /^\s+$/.test(data.p)
}

/*
function isEmpty(a, b) {
    return (/^\s+$/.test(a) || /^\s+$/.test(b))
}

function isClean(str) {
    return !/[~`!#$%\^&*+=\-\[\]\\',/{}|\\":<>\?]/g.test(str) && !/\s/g.test(str)
}

function noSpecial(str){
 return !/[~`!#$%\^&*+=\-\[\]\\',/{}|\\":<>\?]/g.test(str)
}

function hasWhiteSpace(s) {
  return /\s/g.test(s)
}
*/

function displayTime() {
    var str = "";
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}



module.exports = Login