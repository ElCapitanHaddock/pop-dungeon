
var sessionStoreOpts = {
  filename: './data/sessions.db',
  timestampData: true
}

var Datastore = require('nedb'),
  SessionStore = new Datastore(sessionStoreOpts)

SessionStore.loadDatabase(function (err) {
    if (err) throw(err)
})

const cmax = 1209600000 //session max age, as well as verification max age (milliseconds). 14 days

SessionStore.ensureIndex({ fieldName: 'updatedAt', expireAfterSeconds: cmax / 1000 }, function (err) { if (err) console.error(err) });
        
  
var express = require('express')
var bodyParser = require('body-parser')
var esession = require('express-session')
var FileStore = require('session-file-store')(esession)
var app = express()

var helmet = require('helmet')
app.use(helmet.noSniff())

var compression = require('compression')
app.use(compression())

var sess_options = {
  path: "./sessions/",
  reapAsync: true,
  reapSyncFallBack: true,
  retries: 1,
  ttl: cmax,
}

var memStore = new FileStore(sess_options)
app.use(esession({
  store: memStore,
  secret: 'ByEZpaFF1CHI4TcWmmKY',
  /* Regarding resave: I "touch" the session after succesful access to the application page
  That way, if someone visits the page continously, but never logs in or goes to the app, the session will not be renewed and will expire eventually.
  But if someone visits the application, the session expiration date is refreshed, so the regular user will never have to relog back in.
  */
  resave: false,
  saveUninitialized: false,
}))

app.use( bodyParser.json({limit:"1000mb"}) )
app.use(bodyParser.urlencoded({
  extended: false,
  limit:"1000mb",
}))

var Login = require('./login.js')
var User = require('./user.js')


var api = require('./api-request.js')
var API = new api()

var login = new Login(app, API, SessionStore)
var user = new User(app, API, SessionStore)

app.use('/', login.express)
app.use('/app', user.express)

app.set('port', 8080)
var server = app.listen(app.get('port'), function() {
  var port = server.address().port
  console.log('Server started at ' + displayTime())
})


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








