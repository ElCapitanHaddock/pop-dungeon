
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
                                req.token = sessions[0].id //PASS TOKEN
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
    
    
    var exampleGuilds = [
        {
            name: "Math Wizards",
            cl: "Algebra",
            id: "109hf",
            short: "Mr. Travis's classroom",//"http://www.neatorama.com/wp-content/uploads/2011/05/gandalf.jpg",
            members: 20,
            background: "https://i.redd.it/qmfjuz883g7z.png",
            world: "Open Plain",
            color: "pink"
        },
        {
            name: "Los Caballeros",
            cl: "Spanish",
            id: "qiob62",
            short: "Clase de Senora Robertson",
            background: "bg_game.png",//"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tv%C3%A5handssv%C3%A4rd%2C_Italien%2C_ca_1623_-_Skoklosters_slott_-_67303.tif/lossy-page1-220px-Tv%C3%A5handssv%C3%A4rd%2C_Italien%2C_ca_1623_-_Skoklosters_slott_-_67303.tif.jpg",
            world: "Green Hills",
            members: 21,
            color: "blue"
        },
        {
            name: "Mr. Ivy League",
            cl: "History",
            id: "io3gb",
            short: "Mr. Ivy's Class",
            background: "https://steamuserimages-a.akamaihd.net/ugc/100603690261120555/3288949BD5D35B3BCFA9DE0B65FAADE54BBD701C/",//"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/220px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg",
            world: "Silent Forest",
            members: 16,
            color: "teal"
        },
    ]
    
    
    
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
        var td = {}
        td.clubs = exampleGuilds
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
    //tbd, multiple answers for a question, function to submit "wrong" answer asking for approval
    //also, types of answers, e.g. "true": yes, yeah, correct, true
    //also, input types (i.e. numbers only, letters only, etc.)
    /*
    109hf
    qiob62
    io3gb
    */
    
    //get list of events    
    /*user.get('/events/:club', function(req, res) {
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
        })
        var push = exampleGuilds[aoIndex(exampleGuilds, cid, 'id')]
        res.send(push) //temporary
        res.end()
    })*/
    
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
    
    var exampleMonsters = [
        {
            id:"109hf", //Algebra
            monsters: [
                {
                    name:"Orange Dude",
                    level: "5",
                    loot: 1000000,
                    avatar:"http://i0.kym-cdn.com/photos/images/facebook/000/937/684/915.png",
                    questions: [
                        {question: 'Who is the best?',
                        answer: 'Donald J Trump'},
                        {question: 'Who is #1?',
                        answer: 'Donald J Trump'},
                        {question: 'What is my favorite fruit??',
                        answer: 'Donald J Trump'},
                        {question: 'Who is a stable genius?',
                        answer: 'Donald J Trump'},
                        {question: 'Who makes the best steaks?',
                        answer: 'Donald J Trump'},
                        {question: 'Who is Kim Jong Un most scared of?',
                        answer: 'Donald J Trump'},
                        {question: 'Who has the most glorious toupee?',
                        answer: 'Donald J Trump'},
                        {question: 'Who has a million dollar loan?',
                        answer: 'Donald J Trump'},
                        {question: 'Who does Mr. Town absolutely adore?',
                        answer: 'Donald J Trump'},
                        {question: 'Who am I?',
                        answer: 'Donald J Trump'},
                        {question: 'Who has a prosperously firm girth?',
                        answer: 'Donald J Trump'},
                        {question: 'Who defies the Reptilian Commi-Nazis?',
                        answer: 'Donald J Trump'},
                        {question: 'What is love?',
                        answer: 'Donald J Trump'},
                        {question: 'What is the meaning of life?',
                        answer: 'Donald J Trump'},
                        {question: 'Who did you vote for?',
                        answer: 'Donald J Trump'},
                        {question: 'Who deserves an official state religion?',
                        answer: 'Donald J Trump'},
                        {question: 'Who does everyone love?',
                        answer: 'Donald J Trump'},
                        {question: 'Who is Donald J Trump?',
                        answer: 'Donald J Trump'},
                        {question: "Who's gonna pay for the wall?",
                        answer: 'Not Donald J Trump'},
                    ]
                },
            ]
        },
        {
            id:"io3gb", //History
            monsters: [
                {
                    name:"WWI Hiss-tory",
                    level: "10",
                    loot: 1200,
                    avatar:"https://static.drips.pw/rotmg/wiki/Enemies/NM%20Green%20Dragon%20God%20Hardmode.png",
                    questions: [
                        {question: "What was the last name of the general in charge of American troops in WWI?",
                        answer: "Pershing"},
                        {question: 'What is the name of the famous Mexican soldier who raided towns in Southern Texas?',
                        answer: 'Pancho Villa'},
                        {question: 'What was the largest American battle in history?',
                        answer: 'Meuse-Argonne offensive'},
                        {question: 'What German party took blame for the armistice at the end of WW1?',
                        answer: 'The Socialists'},
                        {question: 'How many soldiers did America lose in total?',
                        answer: '112,000'},
                        {question: 'How American troops died directly from battle?',
                        answer: '48,000'},
                        {question: 'How American troops died from disease?',
                        answer: '64,000'},
                        {question: 'How American troops were wounded in total?',
                        answer: '230,000'},
                        {question: 'How soldiers died on all sides?',
                        answer: '10,000,000'},
                        {question: 'How civilians died in total?',
                        answer: '20,000,000'},
                        {question: 'In which country were there the most civilian casualties?',
                        answer: 'Russia'},
                    ]},
                    
                    {
                    name:"Kaiser Wilhem",
                    level: "12",
                    loot: 2000,
                    avatar:"http://piq.codeus.net/static/media/userpics/piq_70844_400x400.png",
                    questions: [
                        {question: "You are under arrest for your crimes against the galaxy.",
                        answer: "It's treason then."},
                        {question: "The senate will decide your fate.",
                        answer: "I AM THE SENATE."},
                        {question: "Not yet.",
                        answer: "I AM THE SENATE."},
                    ]},
                    
                    {
                        name:"Orange Dude",
                        level: "5",
                        loot: 1000000,
                        avatar:"https://opengameart.org/sites/default/files/trump%20pixel%20grande.png",
                        questions: [
                            {question: 'Who is the best?',
                            answer: 'Donald J Trump'},
                            {question: 'Who is #1?',
                            answer: 'Donald J Trump'},
                            {question: 'What is my favorite fruit??',
                            answer: 'Donald J Trump'},
                            {question: 'Who is a stable genius?',
                            answer: 'Donald J Trump'},
                            {question: 'Who makes the best steaks?',
                            answer: 'Donald J Trump'},
                            {question: 'Who is Kim Jong Un most scared of?',
                            answer: 'Donald J Trump'},
                            {question: 'Who has the most glorious toupee?',
                            answer: 'Donald J Trump'},
                            {question: 'Who has a million dollar loan?',
                            answer: 'Donald J Trump'},
                            {question: 'Who does Mr. Town absolutely adore?',
                            answer: 'Donald J Trump'},
                            {question: 'Who am I?',
                            answer: 'Donald J Trump'},
                            {question: 'Who has a prosperously firm girth?',
                            answer: 'Donald J Trump'},
                            {question: 'Who defies the Reptilian Commi-Nazis?',
                            answer: 'Donald J Trump'},
                            {question: 'What is love?',
                            answer: 'Donald J Trump'},
                            {question: 'What is the meaning of life?',
                            answer: 'Donald J Trump'},
                            {question: 'Who did you vote for?',
                            answer: 'Donald J Trump'},
                            {question: 'Who deserves an official state religion?',
                            answer: 'Donald J Trump'},
                            {question: 'Who does everyone love?',
                            answer: 'Donald J Trump'},
                            {question: 'Who is Donald J Trump?',
                            answer: 'Donald J Trump'},
                            {question: "Who's gonna pay for the wall?",
                            answer: 'Not Donald J Trump'},
                    ]},
            ]
        },
        {
            id:"qiob62", //Spanish
            monsters: [
                {
                    name:"Aethlwyn",
                    level: "20",
                    loot: 500,
                    avatar:"http://wikiwiki.jp/rmd/?plugin=ref&page=img4&src=Pyyr%20HM.png",
                    questions: [
                        {question: 'Translate "Hechizo de magia" to English',
                        answer: 'Magic spell'},
                        {question: 'Translate "Espada" to English',
                        answer: 'Sword'},
                        {question: 'Translate "Escudo" to English',
                        answer: 'Shield'},
                        {question: 'Translate "Mitología" to English',
                        answer: 'Mythology'},
                        {question: 'Translate "Empresa" to English',
                        answer: 'Quest'},
                        {question: 'Translate "Mago" to English',
                        answer: 'Wizard'},
                        {question: 'Translate "Picaro" to English',
                        answer: 'Rogue'},
                        {question: 'Translate "Guerrero" to English',
                        answer: 'Warrior'},
                        {question: 'Translate "Nigromante" to English',
                        answer: 'Necromancer'},
                        {question: 'Translate "Brujo" to English',
                        answer: 'Warlock'},
                        {question: 'Translate "Cazador" to English',
                        answer: 'Hunter'},
                        {question: 'Translate "Mazmorra" to English',
                        answer: 'Dungeon'},
                        {question: 'Translate "Monstruo" to English',
                        answer: 'Monster'},
                        {question: 'Translate "Espanto" to English',
                        answer: 'Ghost'},
                        {question: 'Translate "Enano" to English',
                        answer: 'Dwarf'},
                        {question: 'Translate "Duende" to English',
                        answer: 'Elf'},
                        {question: 'Translate "Orco" to English',
                        answer: 'Orc'},
                        {question: 'Translate "Botín" to English',
                        answer: 'Loot'},
                        {question: 'Translate "Lanzar un hechizo" to English',
                        answer: 'To cast a spell'},
                    ]
                },
                {
                    name:"Kürna",
                    level: "31",
                    loot: 1200,
                    avatar:"http://wikiwiki.jp/rmd/?plugin=ref&page=img4&src=Nikao%20HM.png",
                    questions: [
                        {question: "How do you say 'the street' in Spanish?",
                        answer: "la calle"},
                        {question: "How do you say 'to back up' in Spanish?",
                        answer: "retroceder"},
                        {question: "How do you say 'to jump' in Spanish?",
                        answer: "saltar"},
                        {question: "Translate 'to fasten'",
                        answer: "abrocharse"},
                        {question: "Translate 'to turn off'",
                        answer: "apagar"},
                        {question: "Translate 'to turn on'",
                        answer: "encender"},
                        {question: "Translate 'to turn'",
                        answer: "doblar"},
                        {question: "Translate 'the traffic light'",
                        answer: "el semaforo"},
                        {question: "Translate 'the block'",
                        answer: "el cuadro"},
                        {question: "Translate 'to rise'",
                        answer: "despegar"},
                        {question: "Translate 'to land'",
                        answer: "aterrizar"},
                        {question: "Translate 'el pasillo'",
                        answer: "the aisle"},
                        {question: "Translate 'los huevos revueltos'",
                        answer: "the scrambled eggs"},
                        {question: "Translate 'la miel'",
                        answer: "the honey"},
                        {question: "Translate 'las sabanas'",
                        answer: "the sheets"},
                        {question: "Translate 'la percha/el colgador'",
                        answer: "the hanger"},
                        {question: "Translate 'I forgot'",
                        answer: "Me olvide"},
                        {question: "Translate 'I left it'",
                        answer: "Me deja"},
                        {question: "Translate 'I missed it'",
                        answer: "Me falta"},
                        {question: "Translate 'the towel'",
                        answer: "la toalla"},
                    ]},
                    
                    {
                    name:"Eddie",
                    level: "50",
                    loot: 2000,
                    avatar:"https://static.drips.pw/rotmg/wiki/Enemies/Horrific%20Creation.png",
                    questions: [
                        {question: "Translate 'la secadora de pelo'",
                        answer: "the hair dryer"},
                        {question: "Translate 'the bugs'",
                        answer: "los bichos"},
                        {question: "Translate 'hospedarse'",
                        answer: "to stay"},
                        {question: "Translate 'el tocino'",
                        answer: "the bacon"},
                        {question: "Translate 'the boss'",
                        answer: "el jefe"},
                        {question: "Translate 'the weapon'",
                        answer: "la arma"},
                        {question: "Translate 'the headphones'",
                        answer: "los auriculares"},
                        {question: "What is Samuel Jackson's middle name?",
                        answer: "Leroy"},
                        {question: "Translate 'the microphone'",
                        answer: "el microfono"},
                        {question: "Translate 'loud'",
                        answer: "ruidoso"},
                        {question: "Translate 'My class is loud'",
                        answer: "Mi clase es ruidoso"},
                        {question: "Translate 'Turn of your phones'",
                        answer: "Apaga tus celulares"},
                        {question: "Translate 'Pay attention, please'",
                        answer: "Presta atencion, por favor"},
                        {question: "Translate 'Turn of your phones'",
                        answer: "Apaga tus celulares"},
                        {question: "Translate 'the sword'",
                        answer: "la espada"},
                        {question: "Translate 'the shield'",
                        answer: "el escudo"},
                        {question: "Translate 'pesado'",
                        answer: "heavy"},
                        {question: "Translate 'My sword is heavy'",
                        answer: "Mi escudo es pesado."},
                    ]},
            ]
        },
    ]
    
    //TO BE DEVELOPED::: set and get current abilities and current gear
    user.get('/hero/', function(req, res) {
        api.database.hero.get(req.token, function(error, body) {
            if (!error) {
                res.send(body.info)
                res.end()
            }
            else {
                
        console.log(error)
                res.status(error.status).send(error.code)
                res.end()
            }
        })
    })
    
    user.get('/monsters/:guild', function(req, res) {
        var cid = req.params.guild
        res.send(exampleMonsters[aoIndex(exampleMonsters, cid, 'id')].monsters)
        res.end()
    })
    
    user.get('/questions/:guild', function(req, res) { //sample questions for demo
        var cid = req.params.guild
        res.send(exampleGuilds[aoIndex(exampleGuilds, cid, 'id')].questions)
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

function aoIndex(a, t, p) {
  for (var i = 0, len = a.length; i < len; i++) {
      if (a[i][p] === t) return i;
  }
  return -1;
}

module.exports = User