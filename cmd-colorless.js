
/*
____________________________________________
_________C O M M A N D  C E N T E R_________
--------------------------------------------
*/


var pm2 = require('pm2');
var fs = require('fs')

const repl = require('repl') //command line utilities

const r = repl.start({prompt: '> ', eval: executeEval, writer: Writer})

function executeEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

var started = true
pm2.list(function(err, list) {
  if (list.length == 0) { //if server isn't already running
    started = false
  }
})

function Writer(input) {
  input = input.replace(/(\r\n|\n|\r)/gm,"")
  var syntax = input.split(" ")
  
  //COMMANDS
  switch (syntax[0]) {
    case 'get': //logging
      return get(syntax[1])
    case 'start':
      return start()
    case 'stop':
      return stop()
    case 'reload':
      return reload()
    default:
      return input
  }
}

function get(what) {
  switch(what) {
    case 'info':
      pm2.describe('SERVER', function(err, info) {
        if (err) console.error(err)
        else console.log(info + '\n')
      })
      return '\n -._.-._.-._.-._.-I N F O-._.-._.-._.-._.- \n'
    default:
      return 'What?'
  }
}

function start() {
  if (!started) {
    started = true
    connect()
    return 'Server started!'
  }
  else {
    return 'Server already running!'
  }
}

function stop() {
  if (started) {
    pm2.stop('all', function(err) {
      if (err) throw err
    })
    started = false
    return 'Server stopped!'
  }
  else {
    return 'Server already stopped!'
  }
}

function reload() {
  if (started) {
    pm2.reload('all', function(err) {
      if (err) throw err
    })
    return 'Server reloaded!'
  }
  else {
    return 'Server is stopped!';
  }
}

/*reference
http://pm2.keymetrics.io/docs/usage/pm2-api/
*/
function connect() {
  pm2.connect(false, function(err) { //boolean is no-daemon mode
    if (err) {
      console.error(err);
      process.exit(2);
    }
  
    pm2.start('config.json', function(err, apps) {
      if (err) console.log(err);
      else pm2.disconnect()
    })
  })
}