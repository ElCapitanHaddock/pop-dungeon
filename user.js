
var express = require('express')
var path = require('path')
const cmax = 1209600000 //session max age, as well as verification max age (milliseconds). 14 days

//for process memory caching
const NodeCache = require( "node-cache" )
const sessionCache = new NodeCache({
    stdTTL: 3600, //(expire) one hour
    checkperiod: 600, //every 10 minutes
    useClones: false
})
const maxSessions = 200
var numSessions = 0

var User = function(app, api, store) {
    var self = this
    var user = express()
    self.express = user
    
    /*
    ________________________________________________________
    ________________A P P L I C A T I O N___________________
    */
    
    
    //a u t h e n t i c a t i o n
    /*------------------------------
        Check temporary cache for session
            if exists, pass on corresponding token
            else, check database
                if exists, cache in temporary store, then pass on corresponding token
                else, redirect
    */
    
    user.use(function(req, res, next) {
        sessionCache.get(req.session.id, function(err, val) { //check session CACHE for pair
            if (!err) {
                //----------------------------------------
                if (val === undefined) { //CACHE match failure
                    store.loadDatabase(function (err) {})
                    store.find({id: req.session.id}, function(err, sessions) { //verify with DATABASE
                        if (err) {
                            res.status(400).send('error')
                            res.end()
                        }
                        else {
                            if (sessions.length == 0) { //DATABASE match failure, redirect
                                res.redirect('/')
                                res.end()
                            }
                            else { //DATABASE match success, add to cache
                                req.session.cookie.maxAge = cmax //reset cookie expiration
                                if (numSessions >= maxSessions) {
                                    process.nextTick(function() {
                                        numSessions = 0
                                        sessionCache.flushAll()
                                    })
                                }
                                else {
                                    numSessions++
                                }
                                sessionCache.set(req.session.id, sessions[0].token) //set token/id pair into cache
                                req.token = sessions[0].token //PASS TOKEN
                                next()
                            }
                        }
                    })
                }
                //----------------------------------------
                else { //CACHE match success
                    req.token = val //PASS TOKEN
                    next()
                }
            }
            else console.error(err)
        })
    })
    
    
    //d a s h b o a r d
    //------------------------------
    user.get('/dashboard', function(req, res) {
        //TO BE DEVELOPED. ask Jevin
        /*api.getDashboard(req.token, function(status, body) {
            if (status == 200) {
                res.send(body)
                res.end()
            }
            else {
                res.status(403).send('forbidden')
                res.end()
                console.log("body: " + status)
            }
        })*/
        //testing dashboard
        var td = {}
        td.clubs = [    //temporary, until backend fully implemented
            {
                name: "Club 1",
                id: "club1id",
                short: "This is Club 1, where we do Club 1 stuff",
                icon: "https://semantic-ui.com/images/wireframe/image.png",
                color: "red",
                members: 5
            },
            {
                name: "Club 2",
                id: "club2id",
                short: "This is Club 2, where we do Club 2 stuff",
                icon: "https://semantic-ui.com/images/wireframe/image.png",
                color: "blue",
                members: 7
            },
            {
                name: "Club 3",
                id: "club3id",
                short: "This is Club 3, where we do Club 3 stuff",
                icon: "https://semantic-ui.com/images/wireframe/image.png",
                color: "gray",
                members: 4
            },{
                name: "Club 4",
                id: "club4id",
                short: "This is Club 4, where we do Club 4 stuff",
                icon: "https://semantic-ui.com/images/wireframe/image.png",
                color: "orange",
                members: 4
            },
        ]
        res.send(td)
    })
    
    
    //c a l e n d a r
    //------------------------------
    
    //EXAMPLES
      //{title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      //{id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      //{id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      //{title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      //{title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    //EXAMPLE ARCHITECTURE
    var exampleClubs = [
        [
          {title: 'Club 1 Meeting',start: new Date(y, m, 20), id: "32o3bg", clubid: "clubid1"},
          {title: 'Club 1 Orientation',start: new Date(y, m, 2), id: "12oi3b", clubid: "clubid1"},
          {title: 'Club 1 Event',start: new Date(y, m, 3), id: "1o3in", clubid: "clubid1"},
        ],
        [
          {title: 'Club 2 Meeting',start: new Date(y, m, 15), id: "1ionf", clubid: "clubid2"},
          {title: 'Club 2 Orientation',start: new Date(y, m, 6), id: "13iobg", clubid: "clubid2"},
          {title: 'Club 2 Event',start: new Date(y, m, 7), id: "13ogic", clubid: "clubid2"},
        ],
        [
          {title: 'Club 3 Meeting',start: new Date(y, m, 6), id: "13uibg", clubid: "clubid3"},
          {title: 'Club 3 Orientation',start: new Date(y, m, 1), id: "1oi3gh", clubid: "clubid3"},
          {title: 'Club 3 Event',start: new Date(y, m, 1), id: "aiosbv", clubid: "clubid3"},
        ],
        [
          {title: 'Club 4 Meeting',start: new Date(y, m, 26), id: "12iobh", clubid: "clubid3"},
          {title: 'Club 4 Orientation',start: new Date(y, m, 17), id: "oaisbv", clubid: "clubid3"},
          {title: 'Club 4 Event',start: new Date(y, m, 23), id: "102hfa", clubid: "clubid3"},
        ]
    ]
    
    //get lsit of events    
    user.get('/events/:club', function(req, res) {
        var cid = req.params.club
        /*api.getEvents(req.token, cid, function(status, body) {
            if (status == 200) {
                res.send(body) //send events for club
                res.end()
            }
            else {
                res.status(403).send('forbidden')
                res.end()
                console.log("body: " + status)
            }
        })*/
        res.send(exampleClubs[cid]) //temporary
        res.end()
    })
    
    //get specific event info
    user.get('/eventInfo/:club/:id', function(req, res) {
        var cid = req.params.club
        var eid = req.params.id
        /*api.getEventInfo(req.token, cid, eid, function(status, body) {
            if (status == 200) {
                res.send(body) //send event info
                res.end()
            }
            else {
                res.status(403).send('forbidden')
                res.end()
                console.log("body: " + status)
            }
        })*/
        res.send('example info')
        res.end()
    })
    
    //l o g  o u t
    //------------------------------
    //When a user logs out, remove all tokens associated with session from database
    user.post('/logout', function(req, res) {
        sessionCache.del(req.session.id)
        store.loadDatabase(function (err) {})
        store.remove({id: req.session.id}, {multi: true}, function(err, numRemoved) { //atm: remove multiple
            if (err) {
                res.status(400).send('error')
                res.end()
            }
            else {
                req.session.logged = false
                req.session.token = false
                res.send("success")
                res.end()
            }
       })
    })
    
    //s e r v e  f i l e s
    //------------------------------
    user.use(express.static(path.join(__dirname, 'client/app')))
}

module.exports = User