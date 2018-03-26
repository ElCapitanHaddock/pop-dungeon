
/*global app*/
/*global Phaser*/

app.controller("GAME", function($scope, $rootScope, $http, $timeout, $interval) {
    $rootScope.GAME_WORLD;
    $scope.$on('reloadGame', function() {
        $scope.init()
    })
    
    var energyBar = $('#energyBar')
    var timeBar = $('#timeBar')
    var abilityButton = $('#abilityButton')
    
    $scope.init = function() {
        //timeBar.progress({total: 300, value: 299})
        energyBar = $('#energyBar')
        timeBar = $('#timeBar')
        abilityButton = $('#abilityButton')
        document.getElementById("render").innerHTML = "";
        $rootScope.GAME_WORLD = new Game($scope);
        $scope.startGame() //start game state
        $scope.selectQuestion()
        $scope.$apply()
    }
    function Game($scope) {
        //CLEAR OUT PREVIOUS CANVASES
        
        var self = this
        self.func = {} //functions
        
        function getW() {
            return $("#GAME_CONTAINER").width()
        }
        function getH() {
            if (window.innerHeight > 400) { //560
                return 400
            }
            return window.innerHeight - 350
        }
        
        var game = new Phaser.Game(getW(), getH(), Phaser.CANVAS, 'render', { preload: preload, create: create, update: update, render: render });
        self.game = game
        
        function preload() {
            //https://static.drips.pw/rotmg/wiki/Enemies/NM%20Black%20Dragon%20God.png
            game.load.image('boss', $rootScope.monsters[$rootScope.currentMonster].avatar);
            game.load.image('arrow', 'http://examples.phaser.io/assets/sprites/asteroids_ship.png');
            game.load.image('hero', $rootScope.hero.avatar)
            game.load.image('bg', $rootScope.club.background);
            game.physics.startSystem(Phaser.Physics.ARCADE);
        }
        
        self.world = {}
        self.world.sprites = {}
        var sprites = self.world.sprites
        var worldGroup
        function create() {
            //game.stage.backgroundColor = '#124184';
            
            worldGroup = game.add.group()
            sprites.bg = game.add.sprite(150, 0, 'bg');
            sprites.bg.smoothed = false;
            sprites.bg.width = 1270;
            sprites.bg.height = 560;
            sprites.bg.anchor.setTo(0.5, 0.5);
            worldGroup.add(sprites.bg)
            
            sprites.boss = game.add.sprite(250, 0, 'boss');
            var old_width = Number(sprites.boss.width)
            sprites.boss.height *= sprites.boss.width / 192;
            sprites.boss.width = 192;
            sprites.boss.anchor.setTo(0.5, 0.5);
            sprites.boss.scale.x = -1;
            worldGroup.add(sprites.boss)
            
            sprites.bossEmitter = game.add.emitter(300, -20, 120);
            sprites.bossEmitter.makeParticles('boss');
            sprites.bossEmitter.minParticleScale = 0.025;
            sprites.bossEmitter.maxParticleScale = 0.05;
            sprites.bossEmitter.gravity = 200;
            sprites.bossEmitter.bounce.setTo(0.5, 0.5);
            sprites.bossEmitter.minParticleSpeed.x = 200
            sprites.bossEmitter.maxParticleSpeed.x = 450
            sprites.bossEmitter.minParticleSpeed.y = 50
            sprites.bossEmitter.maxParticleSpeed.y = 350
            sprites.bossEmitter.angularDrag = 20;
            worldGroup.add(sprites.bossEmitter)
            
            //boss healthbar
            var hb = game.add.bitmapData(800, 15);
            hb.ctx.beginPath();
            hb.ctx.rect(0, 0, 500, 500);
            hb.ctx.fillStyle = 'red';
            hb.ctx.fill();
            sprites.healthbar = game.add.sprite(250, -130, hb);
            sprites.healthbar.anchor.setTo(0.5, 0.5);
            sprites.healthbar.width = $scope.boss.health * 10
            sprites.healthbar.alpha = 0.5;
            sprites.healthbar.fixedToCamera = true;
            worldGroup.add(sprites.healthbar)
            
            sprites.hero = game.add.sprite(-200, 75, 'hero');
            sprites.hero.anchor.setTo(0.5, 0.5);
            sprites.hero.width = 48;
            sprites.hero.height = 48;
            game.camera.follow(sprites.hero);
            
            worldGroup.add(sprites.hero)
            worldGroup.position.setTo(getW() / 2, getH() / 2);
            game.camera.focusOnXY(game.world.centerX, game.world.centerY);
        }
        
        self.func.damageBoss = function(dur, dmg) {
            sprites.bossEmitter
            var tween = game.add.tween(sprites.hero).to( { x: 150  }, 200, Phaser.Easing.Linear.Out, true, 0, 0);
            tween.onComplete.add(function() {
                game.add.tween(sprites.hero).to( { x: -200  }, 200, Phaser.Easing.Linear.InOut, true, 0, 0);
                
                sprites.bossEmitter.alpha = 1;
                sprites.bossEmitter.explode(dur, dmg * 1000);
                console.log(dmg)
                sprites.bossEmitter.emitFade = game.add.tween(sprites.bossEmitter).to({alpha: 0}, dur - 50, Phaser.Easing.Linear.None, true);
                var tween2 = game.add.tween(sprites.boss).to( { y: -50 * dmg  }, 100, Phaser.Easing.Linear.Out, true, 0, 0);
                tween2.onComplete.add(function() {
                    game.add.tween(sprites.boss).to( { y: 0  }, 100, Phaser.Easing.Linear.None, true, 0, 0);
                }, this)
            }, this)
        }
        
        self.func.killBoss = function() {
            sprites.boss.destroy();
        }
        
        function update() {
            if ($scope.boss.health <= 0) {
                sprites.healthbar.width = 0
            }
            else {
                sprites.healthbar.width = $scope.boss.health * 10
            }
        }
        
        function render() {
        
        }
        
        self.func.resizeGame = function() {
            var height = getH();
            var width = getW();
            if (game !== undefined) {
                worldGroup.position.setTo(width / 2, height / 2);
                game.width = width;
                game.height = height;
                game.renderer.resize(width, height)
                if (game.stage.bounds !== undefined) {
                    game.stage.bounds.width = width;
                    game.stage.bounds.height = height;
                    if (game.renderType === Phaser.WEBGL) {
                        game.renderer.resize(width, height)
                    }
                }
            }
        }
        $(window).on('resize', function(){
            $rootScope.GAME_WORLD.func.resizeGame();
        })
    }
    
    $scope.energy = 0
    
    $scope.time = 300; // seconds
    timeBar.progress('set total', 300)
    var timeInt;
    $scope.startGame = function() {
        
        //stuff for restarting or starting game
        if (timeInt !== undefined) $interval.cancel(timeInt)
        $scope.questions = $rootScope.monsters[$rootScope.currentMonster].questions
        $scope.res.correct = 0
        $scope.res.incorrect = 0
        $scope.OK = true
        $scope.boss.health = 20
        $scope.energy = 0
        $scope.time = 300;
        //stuff
        
        timeInt = $interval(function() {
            $scope.time--
            timeBar.progress('update progress', Number($scope.time))
            if ($scope.time <= 0) {
                $scope.endGame('defeat')
            }
        }, 250)
    }
    
    /*
    $scope.loadQuestions = function() {
      $http(
          {
          method: "GET",
          url: "/app/questions/" + $rootScope.club.id
      }).then(function(res) {
            $scope.questions = res.data;
            $scope.answeredQuestions = []
            $scope.selectQuestion()
      }, function(err) {
        console.error(err)
      })
    }
    $scope.loadQuestions();
    */
    
    $scope.question = ""
    $scope.correctAnswer = ""
    $scope.answerState = "" //error, success, etc.
    
    $scope.res = {
        incorrect: 0,
        correct: 0,
    }
    
    $scope.answer; //dynamic, representing answer in text
    
    $scope.selectQuestion = function() {
        var current = $scope.question
        if ($scope.questions.length == 0) {
            if ($scope.answeredQuestions.length !== 0) { //refill with already correct questions
                $scope.questions = Object.assign({}, $scope.answeredQuestions)
            }
            else {} //no questions at all?
        }
        else {
            var random = $scope.questions[Math.floor(Math.random()*$scope.questions.length)]
            while (current == random.question) {
                random = $scope.questions[Math.floor(Math.random()*$scope.questions.length)];
            }
            $scope.question = random.question
            $scope.correctAnswer = random.answer
        }
    }
    
    $scope.OK = true //per question, see if this specific question ever incorrectly answered
    $scope.submitAns = function() {
        //FOR NOW, TESTING
        if ($scope.answer.length !== 0 && simplify($scope.answer).length !== 0) {
            var pass = $scope.checkAns($scope.answer);
            if (pass) {
                $scope.res.correct++
                document.getElementById("answer").placeholder = "Answer"
                if ($scope.OK) { //only add energy to ability if answered correctly on first try
                    if ($scope.energy < 5) { //tbd, max energy param
                        energyBar.progress('increment');
                        $scope.energy++
                    }
                    if ($scope.energy >= 5) {
                        energyBar.transition('flash') //to remind that ability ready
                        abilityButton.transition('jiggle')
                    }
                }
                else {
                    $scope.OK = true
                }
                $scope.answerState = ""
                $scope.answer = ""
                if ($scope.questions.indexOf && $scope.questions.indexOf($scope.question.name) !== - 1) {
                    var save = String($scope.question); //drop reference
                    $scope.questions.splice($scope.questions.indexOf($scope.question.name), 1)
                    $scope.answeredQuestions.push(save)
                }
                $scope.damageBoss($scope.stats.auto)
                if ($scope.boss.health > 0) {
                    $("#question_icon").transition("flash")
                    $scope.selectQuestion() //get random question/answer
                }
            }
            else {
                $("#answer").transition('bounce')
                $("#answer").attr('placeholder',$scope.correctAnswer)
                $("#answer").val("")
                if ($scope.OK) {
                    $scope.res.incorrect++
                }
                $scope.answerState = "error"
                $scope.lastQuestion = $scope.question
                $scope.OK = false;
            }
        }
    }
    
    $scope.checkAns = function(answer) {
        if (simplify(answer).indexOf(simplify($scope.correctAnswer)) >= 0) {
            return true
        }
        return false
    }
    
    $scope.checkEnergy = function(name) {
        //check if ability meets energy requirement
        //in the future, hold energy value on server, TBD
        //$scope.energy = energyBar.progress("get value")
        if ($rootScope.abilityStats[name] !== undefined && $scope.energy >= $rootScope.abilityStats[name].energy) {
            return ""
        }
        return "disabled"
        //return "green"
    }
    $scope.stats = { //hero stats
        auto: 1, //auto attack damage
        multiplier: 1
    }
    
    
    $("#energyBar").progress("set total", $rootScope.abilityStats[$rootScope.hero.current.ability].energy)
    $scope.useAbility = function() {
        var name = $rootScope.hero.current.ability
        var cost = $rootScope.abilityStats[name].energy
        if ($rootScope.abilityStats[name] !== undefined && $scope.energy >= cost) {
            var effect = $rootScope.abilityStats[name].effect
            $scope.executeAbility(effect)
            $scope.energy = 0
            energyBar.progress("reset")
            document.getElementById("answer").focus()
        }
    }
    
    $scope.executeAbility = function(effect) {
        var type = effect.type
        var ctx = effect.ctx
        switch (type) {
            case "damage":
                $scope.damageBoss(ctx)
                break
            case "crit buff": //tbd: show buff effect on hero
                $scope.stats.multiplier = 2
                break
        }
    }
    
    $scope.boss = {
        name: $rootScope.monsters[$rootScope.currentMonster].name,
        health: $rootScope.monsters[$rootScope.currentMonster].health,
    }
    $scope.damageBoss = function(dmg) {
        $scope.boss.health -= dmg * $scope.stats.multiplier
        if ($scope.stats.multiplier > 1) {
            $scope.stats.multiplier = 1
        }
        $scope.GAME_WORLD.func.damageBoss(600, dmg)
        if ($scope.boss.health <= 0) {
            $scope.killBoss()
        }
    }
    $scope.killBoss = function() {
        $scope.GAME_WORLD.func.killBoss()
        $("#GAME_CONTAINER").transition('tada')
        $scope.endGame('victory')
    }
    
    $scope.endGame = function(res) {
        $interval.cancel(timeInt)
        $timeout(function() {
            timeBar.progress("remove active")
                switch(res) {
                    case "victory":
                        console.log("VICTORY!")
                        timeBar.progress("complete")
                        $scope.boss.health = 20
                        $rootScope.modals.results({
                            modalName: "resultsModal",
                            name: "Victory!",
                            type: "victory",
                            res: $scope.res,
                            timeLeft: $scope.time
                          });
                        break;
                    case "defeat":
                        console.log("DEFEAT...")
                        timeBar.progress("complete")
                        $scope.boss.health = 20
                        $rootScope.modals.results({
                            modalName: "resultsModal",
                            name: "Defeat!",
                            type: "defeat",
                            res: $scope.res,
                            timeLeft: 0
                          });
                        break;
                }
        }, 1000)
    }
    
    
    $scope.questions = $rootScope.monsters[$rootScope.currentMonster].questions
    $scope.selectQuestion()
    
    function simplify(text) { //simplify text
        /*
        capitalization
        punctuation
        spaces
        */
        var punct = /[~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g;
        return text.toLowerCase().replace(punct,"").replace(/\s+/g, '').replace('the', '')
    }
})