

//UNNEEDED - stupid chromium command line fixed everything

/*
var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');

function cookieCheck() {
	fs.readFile('data.json', 'utf8', function (err, data) {
		if (err) { //not found
			setTimeout(function() {
				var opt = {cookies: []};
				win.cookies.getAll({}, function(c) {
					opt.cookies = c;
					opt = JSON.stringify(opt);
					fs.writeFile('data.json', opt, function(err) {
						if (err) alert(err);
					});
				});
			}, 1000);
		}
		else {
			/*
			data = JSON.parse(data);
			var cookies = data.cookies;
			for (var c in cookies) {
				cookies[c].url = "https://" + cookies[c].domain + cookies[c].path;
				var deleteOld = {
					url: cookies[c].url,
					name: cookies[c].name,
					storeId: cookies[c].storeId
				}
				win.cookies.remove( deleteOld );
				delete cookies[c].hostOnly;
				delete cookies[c].session;
				try {
					win.cookies.set( cookies[c] );
				}
				catch(err) {
					alert(err);
				}
			}
		}
	});
}
cookieCheck();

/* COOKIE DEBUG*/
/*
win.on('resize', function() {
	var opt = {};
	win.cookies.getAll(opt, function(c) {
		for (var i = 0; i < c.length; i++) {
			alert(JSON.stringify(c[i]));
		}
	});
});
*/

