
var express = require('express')
var path = require('path')
var Cryptr = require('cryptr')
var bcrypt = require('bcrypt')
var random = require('random-gen')
var should = require('should')

var heroTemplates = [
    {
        //clubid:"qiob62", //Spanish
        name:"Bilbo",
        level: 1,
        kills: 0,
        xp: 0,
        cl: "Knight",
        money:"1590",
        avatar:"http://static.wixstatic.com/media/5a7184_7ae5301c8e764f34911caa0ca8a66e94.png",
        current: {
            weapon: "Sting",
            offHand: "Ancient Ring",
            armor: "Mithryl Mail",
            ability: "Sword Whirl"
        },
        weapons: [
            "Sting",
            "Barrow-blade",
            "Halfling Rapier",
        ],
        offHands: [
            "Smelly Cheese",
            "Pale Ale",
            "Ancient Ring",
        ],
        armor: [
            "Mithryl Mail",
            "Fur Coat",
            "Baggins Booties",
        ],
        abilities: [
            "Detect Orcs",
            "Vanish",
            "Hearty Breakfast",
            "Sword Whirl",
            "Shield Warrior",
        ],
        achievements: [
        ]
    },
    {
        //clubid:"109hf", //Algebra
        level: 1,
        kills: 0,
        xp: 0,
        cl:"Wizard",
        money:"420",
        avatar:"https://vignette2.wikia.nocookie.net/realmofthemadgod/images/8/8f/Wizard_0.png/revision/latest?cb=20111104231251",
        current: {
            weapon: "Elder Wand",
            offHand: "Ancient Relic",
            armor: "Simple Robes",
            ability: "Tornado"
        },
        weapons: [
            "Elder Wand",
            "Simple Staff",
            "Fire Staff",
        ],
        offHands: [
            "Ancient Relic",
            "Dusty Tome",
            "Fireworks",
        ],
        armor: [
            "Simple Robes",
            "Gray Robes",
            "White Robes"
        ],
        items: [
            "Map to Isengard",
            "HP Potion",
            "Mana Potion",
            "Pipeweed"
        ],
        abilities: [
            "Fireball",
            "Tornado",
            "Anti-pass",
            "Enlighten",
            "Soul-sucker"
        ],
        achievements: [
        ]
    },
    {
        //clubid:"io3gb", //Biology
        level: 1,
        kills: 0,
        xp: 0,
        cl:"Thief",
        money:"230",
        avatar:"https://vignette1.wikia.nocookie.net/realmofthemadgod/images/2/29/Archer.png/revision/latest?cb=20111104230908",
        current: {
            weapon: "Elvish Bow",
            offHand: "Quiver",
            armor: "Elvish Tunic",
            ability: "Arrow Rain"
        },
        weapons: [
            "Elvish Bow",
            "Liverroot Bow",
            "Elf-Steel Dagger",
        ],
        offHands: [
            "Quiver",
            "Wicked Elixir",
            "Doubleshot Espresso",
        ],
        armor: [
            "Elvish Tunic",
            "Rivendale Robes",
            "Terrasteel Armor"
        ],
        abilities: [
            "Steady Shot",
            "Arrow Rain",
            "Focus",
            "Serrated Shot",
            "Enrage",
        ],
        achievements: [
        ]
    },
]
    

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
            api.auth.authenticate({email: data.u, password: data.p}, 
            function(error, token) {
                if (!error) {
                    console.log('User ' + data.u + ' logged with ' + token + ' at ' + displayTime())
                    //add session id to database, paired with token
                    updateSession(req.session.id, token)
                    req.session.logged = true //need to "change" the session to bypass saveUninitialized
                    res.send('loggedin')
                    res.end()
                }
                else {
                    res.status(400).send({msg:error})
                    res.end()
                }
            })
        }
        else if (data.u === undefined || empty(data)) {
            res.status(400).send({msg:'empty'})
            res.end()
        }
        else if (!sanitary(data)) {
            res.status(400).send({msg:'illegal'})
            res.end()
        }
        else {
            res.status(400).send({msg:'error'})
            res.end()
        }
    })
    
    
    
    //_______________REGISTER________________
    
    login.post('/register', function(req, res) {
        var data = req.body
        if (sanitary(data) && !empty(data)) {
            var username = data.u.substring(0, data.u.indexOf("@")) //the area before the @ is the username
            console.log(data.cl)
            if (data.cl == undefined || data.cl == null || data.cl < 0 || data.cl > 2) { //0: knight, 1: wizard, 2: thief
                res.status(400).send({msg: "You must pick a hero!"})
            }
            else {
                if (data.n == undefined) { //nickname
                    res.status(400).send({msg: "You must choose a nickname!"})
                }
                else {
                    api.auth.register({email: data.u, name: username, password: data.p, nick: data.n, hero: heroTemplates[data.cl]},
                    function(error, info) {
                        if (!error) {
                            console.log('User ' + data.u + ' registered at ' + displayTime())
                            console.log(info)
                            req.session.logged = false //"change" the session to bypass saveUninitialized
                            res.send('registered')
                            res.end()
                        }
                        else {
                            console.log(error)
                            res.status(400).send({msg: error})
                        }
                    })
                }
            }
        }
        else if (data.u === undefined || empty(data)) {
            res.status(400).send({msg:'empty'})
            res.end()
        }
        else if (!sanitary(data)) {
            res.status(400).send({msg:'illegal'})
            res.end()
        }
        else {
            res.status(400).send({msg:'error'})
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
        console.log(token)
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