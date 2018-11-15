

/*global $*/
/*global angular*/

Date.prototype.getWeekOfMonth = function() {
  var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
  var offsetDate = this.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7);
}

//club list
var cl = $("#clubList");

var app = angular.module('_app', ["ngRoute"]);

app.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});

app.run(function($rootScope, $http, $route, $timeout, $location) {
    $rootScope.maxMonstChar = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 100;
    
    $rootScope.hero
    $rootScope.monsters
    $rootScope.currentMonster = 0
    $rootScope.assets = {
        weapons: {
            "Sting": "http://vignette3.wikia.nocookie.net/realmofthemadgod/images/2/23/Rotmg_4.png/revision/latest?cb=20130921220156",
            "Barrow-blade": "http://www.mediafire.com/convkey/ac0b/hhxbceokzhi8g6ozg.jpg",
            "Halfling Rapier": "http://www.mediafire.com/convkey/02dc/a78e9bbc33biq4tzg.jpg",
            "Elvish Bow": "http://static.wixstatic.com/media/8be03d_9a81c91929c2b31df85aee94db62c21b.png_256",
            "Liverroot Bow": "https://static.drips.pw/rotmg/wiki/Untiered/Bow%20of%20the%20Morning%20Star.png",
            "Elf-Steel Dagger": "http://www.rw-designer.com/cursor-view/42956.png",
            "Elder Wand": "https://vignette2.wikia.nocookie.net/realmofthemadgod/images/0/0d/T12-Wand-of-Recompense-e1339985228183.png/revision/latest?cb=20130915154944",
            "Simple Staff": "http://static.wixstatic.com/media/8be03d_5b72160fe8b279c1e5da05cf009f0e08.png_256",
            "Fire Staff": "http://static.wixstatic.com/media/8be03d_2782b4f12c4c442aa2cc84e6271c1305.png_256",
            
        },
        offHands: {
            "Ancient Relic": "https://static.drips.pw/rotmg/wiki/Untiered/Tome%20of%20Holy%20Protection.png",
            "Dusty Tome": "http://www.mediafire.com/convkey/b9b1/99rxg6fa9w3bb52zg.jpg",
            "Fireworks": "http://www.mediafire.com/convkey/56ec/ldkp46isg0005bczg.jpg",
            "Iron Shield": "http://static.drips.pw/rotmg/wiki/Abilities/Shields/T5%20Mithril%20Shield.png",
            "Ancient Ring": "http://vignette2.wikia.nocookie.net/realmofthemadgod/images/8/82/Ring_of_exalted_dexterity.png/revision/latest?cb=20130501171641",
            "Quiver": "https://static.drips.pw/rotmg/wiki/Environment/Containers/Loot%20Bag%206.png",
            "Wicked Elixir": "http://www.mediafire.com/convkey/e097/t8ucyg534a1yvs0zg.jpg",
            "Doubleshot Espresso": "http://www.mediafire.com/convkey/6250/c6p7jqjuwv56tc7zg.jpg",
            "Pale Ale": "http://www.mediafire.com/convkey/119f/35xn08kn6kd22gdzg.jpg",
            "Smelly Cheese": "http://www.mediafire.com/convkey/c14d/lbsnr79aygbdtq4zg.jpg",
        },
        armor: {
            "Simple Robes": "http://vignette1.wikia.nocookie.net/realmofthemadgod/images/b/bd/T10_Moon_Robe.png/revision/latest?cb=20131208175623",
            "Gray Robes": "http://www.mediafire.com/convkey/98d5/35rnfr5hf1480gazg.jpg",
            "White Robes": "http://www.mediafire.com/convkey/ffef/7xe3ftlgikbthk1zg.jpg",
            "Mithryl Mail": "http://vignette1.wikia.nocookie.net/realmofthemadgod/images/a/ac/Vengeance_armor.png/revision/latest?cb=20131026152108",
            "Elvish Tunic": "https://static.drips.pw/rotmg/wiki/Armor/Leather%20Armor/T5%20Chimera%20Hide%20Armor.png",
            "Rivendale Robes": "http://www.mediafire.com/convkey/9ece/zcekcoukc0zoo3jzg.jpg",
            "Terrasteel Armor": "http://www.mediafire.com/convkey/6265/zkz47s60mwca3qczg.jpg",
            "Fur Coat": "http://www.mediafire.com/convkey/d33f/ck87v8d24xcsh5vzg.jpg",
            "Baggins Booties": "http://www.mediafire.com/convkey/8331/2azi2jzjhjbdj6azg.jpg",
        },
        abilities: {
            "Hearty Breakfast": "https://i.imgur.com/aoANbVY.png",
            "Detect Orcs": "https://static.drips.pw/rotmg/wiki/Enemies/Arena%20Grave%20Caretaker.png",
            "Vanish": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5ndljUKi1SwqVSr1xHvea4mXXM3StAtzILLMbV9XUQe3KVW89",
            "Steady Shot": "https://www.iconfinder.com/data/icons/maps-and-navigation-solid-1/48/26-128.png",
            "Arrow Rain": "https://vignette3.wikia.nocookie.net/overwatch-game/images/8/85/Strza%C5%82a_Rozpryskowa.svg/revision/latest/scale-to-width-down/150?cb=20161109095342&path-prefix=pl",
            "Focus": "https://www.iconfinder.com/data/icons/medical-solid-icons-vol-2/48/054-128.png",
            "Fireball": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdEseO69qB7G6kuWIs5JVKGaTFiC_8rcthVJTKYrGB14o21ruT",
            "Tornado": "https://static.drips.pw/rotmg/wiki/Enemies/Mama%20Mothra.png",
            "Anti-pass": "https://i.imgur.com/KDTPD0p.png",
            "Mirror Image": "https://www.iconfinder.com/data/icons/abstract-geometric-shape/50/double-abstract-geometric-polygon-eye-128.png",
            "Sword Whirl": "https://cdn2.iconfinder.com/data/icons/free-mobile-icon-kit/64/Spiral.png", //aoe melee attack
            "Serrated Shot": "https://www.iconfinder.com/data/icons/simple-lines-2/32/Charge_Electricity_Lightning_Battery_Power_Circle-128.png", 
            "Snipe": "https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-21-128.png",
            "Empty Quiver": "",
            "Enrage": "https://www.iconfinder.com/data/icons/identificon/96/troll-128.png", //Physical damage boost
            "Harden": "https://www.iconfinder.com/data/icons/abstract-geometric-shape/44/hexagon-abstract-geometric-polygon-eye-128.png", //Defense boost
            "Enlighten": "http://www.mediafire.com/convkey/aecc/kpo1prsp5pg3s0yzg.jpg", //Magic damage boost
            "Wombo Combo": "https://www.iconfinder.com/data/icons/abstract-geometric-shape/42/tribal-abstract-geometric-polygon-eye-128.png", //Multi attack
            "Sharpen Blade": "https://www.iconfinder.com/data/icons/abstract-geometric-shape/60/blink-abstract-geometric-polygon-eye-64.png", // + crit chance
            "Soul-sucker": "https://cdn0.iconfinder.com/data/icons/dmitry-mirolyubov/44/halloween_outline-01-128.png", //Leech life effect
            "Bleed": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQQ7lMV3zMuTYz9FCqSMFCl9nN2HhEUtRHSNUeoPBjZtydx6Wz", //Auto-attack at the beginning of each turn
            "Serrated Shot": "https://cdn1.iconfinder.com/data/icons/medicoicons/64/blood.png", //also bleed but ranged
            "git gud": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrSbl8V7KhIV41NInFqaTeGpR1IsS3PuIOpKWyiNVOvAoY-CLh",
            "Rake in the Loot": "http://www.mediafire.com/convkey/6fbc/ti4fz3xil3samnxzg.jpg",
            "Shield Warrior": "https://www.iconfinder.com/data/icons/iconnice-vector-icon/31/Vector-icons_39-48.png", // equipped shields boost attack
            "Shield Bash": "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/shield-128.png",
            
            //M U L T I P L A Y E R  A B I L I T I E S
            "Intimidation": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSokMCW2uCHBtiknQ3ePKOTRBiGGlt-GZKosvBHtKBVdoPp5_lMrA", //Enemy defense or offense decreases depending on the player's armor
            "Vaporwave": "https://i.ytimg.com/vi/cU8HrO7XuiE/hqdefault.jpg", // decrease enemy accuracy
            "Whipping Boy": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTiJ3MRbF-15dyyFucbWovQk6zBTt9hJgxU84RHdEIYa1Npge3", //negate damage incoming to other players
            "Taunt": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95L0v7_NRM3BXfpAkI63ESLP0k6PH5dgf3z6GJ2U9t_C-s-S7", //taunt enemy
            "Egg On": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyQuwWbKNI47Pciy7HJvdvKhSsx9gnpRd---Z9aZ529lLlAky4Ng", //buff everyone's attack
            "Optical Illusion": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkqSZD_hBefrtQzL6u3JZtayILhePq35UFkG8ro3uMi4ZgrNdItQ", //decrease enemy accuracy
            "Invigorate": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt9nT_AfPcgKerE3RCdrvO95ePiWUJVvdVvxImWG9pyca7EpDRjA", //Heal some damage at the beginning of each turn
            "Silvers of Perseus": "https://thumbs.dreamstime.com/x/metal-shield-icon-isolated-white-background-d-illustration-86923662.jpg", //Reflect damage
            "Smoke Bomb": "https://d30y9cdsu7xlg0.cloudfront.net/png/54644-200.png", //buff everyone's evasion
            "Healing Pulse": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Gu9kh2-acRhMq-ODQWHCCsS8GQnCpxicSDoeJtcI61NnNQLm", //heal a broad range of players nearby
            "Bufferizer": "https://www.iconfinder.com/data/icons/abstract-geometric-shape/46/loop-abstract-geometric-polygon-eye-128.png", //PVP- strengthen enemy, but increase exp gained
            "Debufferizer": "https://www.iconfinder.com/data/icons/abstract-geometric-shape/48/connection-abstract-geometric-polygon-eye-128.png", //PVP- weaken enemy, but decrease exp gained
        }
    }
    $rootScope.loadHero = function() {
      $http(
          {
          method: "GET",
          url: "/app/hero/"
      }).then(function(res) {
          $rootScope.hero = res.data;
          //TO DO ~ Remove ^ this garbage 
      }, function(err) {
        console.error(err)
      })
    }
    $rootScope.abilityStats = {
      //"name": {energy: required to activate, effect: type of ability and context}
      "Sword Whirl": {energy: 5, effect: {
          type: "damage",
          ctx: 9
        }},
      "Arrow Rain": {energy: 5, effect: {
          type: "damage",
          ctx: 9
        }},
      "Tornado": {energy: 5, effect: {
          type: "damage",
          ctx: 9
        }},
    }
    //logic end-------------------------
  
    $rootScope.title = "";
    $rootScope.clubs = [] //just names, for club selection list
    $rootScope.club = {
      name:"",
      id: "",
      background: "",
    }
    $rootScope.page = "";
    
    $rootScope.modal = "";
    //reference for the modal, ex. for event modal mref becomes event {title, info, ...}
    $rootScope.mref;
    
    $rootScope.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    //date
    var s = new Date()
    s.setDate(s.getDate())
    $rootScope.thisMonth = s.getMonth()
    $rootScope.thisWeek = s.getWeekOfMonth()
    $rootScope.thisDay = s.getDate()
    $rootScope.thisYear = s.getYear()
    
    $rootScope.getClubs = function() {
        return new Promise(resolve => {
          $http(
              {
              method: "GET",
              url: "/app/dashboard"
          }).then(function(res) {
              var data = res.data
              if (data.clubs == undefined || data.clubs.length == 0) {
                $rootScope.clubs = null
              }
              else {
                for (var i = 0; i < data.clubs.length; i++) {
                    data.clubs[i].open = function(togg) {
                      if (togg) {
                        $rootScope.openClub(this, false)
                      }
                      else {
                        $rootScope.openClub(this, true)
                      }
                    }
                }
              }
              $rootScope.clubs = data.clubs
              resolve()
          }, function(err) {
            console.error(err)
          })
        })
    }
    
    $rootScope.getClub = function() { // a SINGLE club
      return $rootScope.clubs[aoIndex($rootScope.clubs, $rootScope.club.id, 'id')] || {} //gets the club by doing an object-array search
    }
    
    $rootScope.getClubByIndex = function(id) {
      if (aoIndex($rootScope.clubs, id, 'id') == -1) return false
      return $rootScope.clubs[aoIndex($rootScope.clubs, id, 'id')]
    }
    
    $rootScope.checkClub = function($scope) {
        if ($route.current == undefined) {
        }
        else if ($route.current.params.club !== undefined) {
            setTimeout(function() {
              var ref = $rootScope.getClubByIndex($route.current.params.clubid)
              if (!ref) {
                $location.path('/')
                $rootScope.goToCalendar(false)
              }
              else {
                ref.open(true)
              }
            }, 500)
        }
    }
    
    $rootScope.openClub = function(club, toggleSidebar) {
      $rootScope.club = Object.create(club)
      if (toggleSidebar) {
          $rootScope.toggleSidebar()
          window.location = "/app/#" + club.name + "/" + $rootScope.club.id + "/"
      }
      else {
        console.log($route.current)
        if ($route.current !== undefined && $route.current.params.club !== undefined) {
          $route.updateParams({club: $rootScope.club.name, clubid: $rootScope.club.id})
        }
        if ($route.current.params.page == undefined) {
          window.location = "/app/#" + club.name + "/" + $rootScope.club.id + "/"
        }
        else {
          window.location = "/app/#" + club.name + "/" + $rootScope.club.id + "/" + $route.current.params.page
        }
      }
    
    $('#clubInner').transition('scale', '250ms', function() {
        setTimeout(function() {
          $('#clubInner').transition('scale', '250ms')
        }, 350)
      })
      $rootScope.reloadPage()
    }
    
    $rootScope.reloadPage = function() {
      $rootScope.$broadcast('reloadPage')
    }
    $rootScope.reloadGame = function() {
      $rootScope.$broadcast('reloadGame')
    }
    
    $rootScope.toggleSidebar = function() {
      $('.ui.sidebar')
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('toggle')
    }
    
    $rootScope.goToCalendar = function(toggleSidebar) {
      $rootScope.title = "Monster Slayers"
      $rootScope.club.name = ""
      $rootScope.club.id = ""
      $rootScope.club.background = ""
      if ($route.current !== undefined && $route.current.params.club !== undefined) {
        $location.path('/')
      }
      if (toggleSidebar) {
          $rootScope.toggleSidebar()
      }
    }
    
    $rootScope.goToHeroScreen = function(toggleSidebar) {
      modals.hero({modalName: "heroModal"})
    }
    
    $rootScope.logOut = function() {
      $rootScope.removeCookieAuth();
      window.location.assign('https://clubs-sbojevets.c9users.io/');
    }
    
    $rootScope.removeCookieAuth = function() {
        $.ajax({
          method: "POST",
          url: "/app/logout",
          cache: false,
          success: function(){
            console.log("logged out!")
          }
        });
    }
    
    $rootScope.getPage = function() {
      if ($route.current !== undefined) {
        if ($route.current.params.page == undefined) {
          $rootScope.page = "home"
        }
        else if ($('#clubInner').transition('is animating')) {
          return "./club/views/" + $rootScope.page + ".html"
        }
        else if ($rootScope.page != $route.current.params.page) {
            //$('#clubInner').transition({animation:'pulse',duration:'.5s'});
            $('#clubInner').transition('scale', '250ms', function() {
              $rootScope.page = $route.current.params.page
              $rootScope.$digest()
              setTimeout(function() {
                $('#clubInner').transition('scale', '250ms')
              }, 350)
            })
        }
        return "./club/views/" + $rootScope.page + ".html"
      }
      return ""
    }
    
    $rootScope.isActive = function(page) {
      if ($rootScope.page == page) {
        return "active"
      }
      else {
        return ""
      }
    }
    
    $rootScope.getSrc = function() { //get whether to display club or calendar
      if ($rootScope.club.name !== "") {
        return "./club/club.html"
      }
      else{
        return "./calendar/calendar.html"
      }
    }
    
    $rootScope.getBackground = function() {
      if ($rootScope.club.background == "" || $rootScope.club.background == undefined) { return "https://media.cmcdn.net/7c3c1e3a2f74842c788c/21009917/960x640.png" }
      return $rootScope.club.background
    }
    
    $rootScope.getModal = function() {
      if ($rootScope.modal == "") {
        return ""
      }
      return "./modals/" +  $rootScope.modal + ".html"
    }
    
    $rootScope.modals = {}
    var modals = $rootScope.modals
    
    //https://semantic-ui.com/modules/modal.html#/settings
    modals.game = function(info) {
      $rootScope.modal = "game"
      $rootScope.mref = info
      $rootScope.showModal({
        blurring: true,
        closable: false,
        observeChanges: true,
        allowMultiple: false,
        modalName: info.modalName
      })
    }
    
    modals.event = function(event) {
      $rootScope.modal = "event"
      $rootScope.mref = event
      $rootScope.showModal({
        blurring: true,
        observeChanges: true,
        allowMultiple: false,
        modalName: event.modalName
      })
    }
    
    modals.results = function(info) {
      $rootScope.modal = "results"
      $rootScope.mref = info
      $rootScope.showModal({
        blurring: true,
        observeChanges: true,
        allowMultiple: true,
        modalName: info.modalName,
        closable: false,
        allowEnterKey: false,
        approve  : '.positive, .approve, .ok',
      })
    }
    
    modals.hero = function(info) {
      $rootScope.modal = "hero"
      $rootScope.mref = info
      $rootScope.showModal({
        blurring: true,
        observeChanges: true,
        allowMultiple: false,
        modalName: info.modalName,
      })
    }
    
    var opening = false
    $rootScope.showModal = function(settings) {
      if (!opening) {
        opening = true
        $('.ui.modal').modal('hide')
        setTimeout(function() {
          opening = false
          $('.ui.modal').modal('hide')
          $('#' + settings.modalName + '.ui.modal').modal(settings).modal('show')
        }, 750)
      }
    }
    
    
    window.onresize = function() {
        $rootScope.maxMonstChar = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 100;
        $rootScope.$digest()
    }
    
    $rootScope.getClubs()
    $rootScope.loadHero()
    
    $rootScope.debug = function() {
        console.log($route)
        console.log($rootScope)
    }
});

function aoIndex(a, t, p) {
  for (var i = 0, len = a.length; i < len; i++) {
      if (a[i][p] === t) return i;
  }
  return -1;
}