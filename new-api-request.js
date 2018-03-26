

var cryptr = require('cryptr')
var admin = require("firebase-admin");

//example credidentials
//2@2.com
//1234

const src = "https://popdungeon-backend.firebaseio.com/"
var serviceAccount = require("./services/popdungeon-backend-231ecfc285fc.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: src
});

var db = admin.database()
var auth = admin.auth()
var userdata = db.ref("data/heroes")

var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDp47rGLenou-5n778FeVDWymx4LMCdqs8",
    authDomain: "popdungeon-backend.firebaseapp.com",
    databaseURL: "https://popdungeon-backend.firebaseio.com",
    projectId: "popdungeon-backend",
    storageBucket: "popdungeon-backend.appspot.com",
    messagingSenderId: "960632132394"
}
firebase.initializeApp(config);

var Hero = function(id, info, nick) {
    this.id = id
    this.nick = nick
    this.info = info
    this.info.name = nick
    this.classList = [
        "109hf",
        "qiob62",
        "io3gb",
    ]
}

var API = function() {
    var self = this;
    self.auth = {}
    self.database = {}
    self.auth.authenticate = function(opts, cb) { //login user
        firebase.auth().signInWithEmailAndPassword(opts.email, opts.password)
        .then(function(user) {
            cb(null, user.uid)
            /*
            user.getIdToken(true)
            .then(function(token) {
                cb(null, token)
            })
            .catch(function (error) {
                cb(error.code)
            })
            */
        })
        .catch(function(error){
            console.log("Login error: "+ error.code)
            cb(error.code)
        })
    }
    
    self.auth.register = function(opts, cb) { //register user
        auth.createUser({ //self.auth = auth functions, auth = admin auth ref
          email: opts.email,
          emailVerified: false,
          password: opts.password,
          disabled: false
        }).then(function(userRecord) {
            
            var hero = userdata.child(userRecord.uid)
            try {
                var newHero = new Hero(userRecord.uid, opts.hero, opts.nick)
                var newInstance = hero.set(newHero);
                cb(null, userRecord.uid);
            }
            catch(error) {
                cb(error);
            }
        })
        .catch(function(error) {
            console.log("Registration error: "+ error.code)
            cb(error.code)
        });
    }
    
    self.database.hero = {}
    var hero = self.database.hero
    
    hero.get = function(id, cb) { //get hero info
        var ref = userdata.child(id);
        ref.once("value")
        .then(function(snapshot) {
            cb(null, snapshot.val())
        })
        .catch(function(error) {
            cb(error)
        });
    }
    
    self.database.user = {}
    var user = self.database.hero
    
    user.get = function(id, cb) { //get user info
        var ref = userdata.child(id);
        ref.once("value")
        .then(function(snapshot) {
            cb(null, snapshot.val())
        })
        .catch(function(error) {
            cb(error)
        });
    }
}

/*
var test = new API()

test.instance.create({
        name: "test2",
        owner: "Jack",
        type: 0,
        pass: "password"
    }, function(error, key) {
        if (error) console.error(error)
        else console.log(key)
    })
test.instance.get("test", function(error, inst) { //if null, not found
    if (error) console.error(error)
    else console.log(inst)
})
*/

//var test = new API()
//testing
//login testing
/*
test.auth.authenticate({email: "s-jeryang@lwsd.org", password: "1234"}, function(error, token) {
    if (error) console.log(error)
    else console.log(token)
})
test.auth.authenticate({email: "jkid@littlefish.us", password: "1234"}, function(error, token) {
    if (error) console.log(error)
    else console.log(token)
})
*/
//registration testing
/*
test.auth.register({email: "jkid@littlefish.us", password: "chucknorris"}, function(error, id) {
    if (error) console.log(error)
    else console.log(id)
})
test.auth.register({email: "qvienbqio", password: "1234"}, function(error, id) {
    if (error) console.log(error)
    else console.log(id)
})
test.auth.register({email: "s-jeryang@lwsd.org", password: "1234"}, function(error, id) {
    if (error) console.log(error)
    else console.log(id)
})
*/


module.exports = API;
