
/*
____________________________________________.
_________C O M M A N D  C E N T E R_________|---------.:::::::====-------
--------------------------------------------|`````````'
*/


var pm2 = require('pm2');
var fs = require('fs')

const repl = require('repl') //command line utilities
const chalk = require('chalk')
var failure = chalk.bold.red
var success = chalk.bold.green

const r = repl.start({prompt: '> '})

var started = true
pm2.list(function(err, list) {
  if (list.length == 0) { //if server isn't already running
    started = false
  }
})

r.defineCommand('start', {
  help: 'START the server',
  action() {
    this.lineParser.reset();
    this.bufferedCommand = '';
    console.log(start())
    this.displayPrompt();
  }
})

r.defineCommand('stop', {
  help: 'STOP the server',
  action() {
    this.lineParser.reset();
    this.bufferedCommand = '';
    console.log(stop())
    this.displayPrompt();
  }
})

r.defineCommand('reload', {
  help: 'RELOAD the server',
  action() {
    this.lineParser.reset()
    this.bufferedCommand = ''
    console.log(reload())
    this.displayPrompt()
  }
})

r.defineCommand('get', {
  help: 'Get information',
  action(what) {
    this.lineParser.reset()
    this.bufferedCommand = ''
    get(what, this)
  }
})


function get(what, ctx) {
  switch(what) {
    case 'info':
      pm2.describe('SERVER', function(err, info) {
        if (err) {
          console.log(err)
          ctx.displayPrompt()
        }
        else {
          console.log('\n -._.-._.-._.-._.-I N F O-._.-._.-._.-._.- \n')
          for (var i = 0; i < info.length; i++) {
            console.log('_______' + i + ': ' + info[i].name + '_______')
            console.log(JSON.stringify(info[i]))
          }
          console.log('--------END--------')
          ctx.displayPrompt()
        }
      })
      break
    default:
      console.log('What?')
      ctx.displayPrompt()
  }
}

function start() {
  if (!started) {
    started = true
    connect()
    return success('Server started!')
  }
  else {
    return failure('Server already running!')
  }
}

function stop() {
  if (started) {
    pm2.stop('all', function(err) {
      if (err) throw err
      else started = false
    })
    return success('Server stopped!')
  }
  else {
    return failure('Server already stopped!')
  }
}

function reload() {
  if (started) {
    pm2.reload('all', function(err) {
      if (err) throw err
    })
    return success('Server reloaded!')
  }
  else {
    return failure("There's nothing to restart!")
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