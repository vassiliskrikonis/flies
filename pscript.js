var flyBase;
var svg = project.importSVG('fly.svg', function(item) {
	flyBase = item.children[0];
	init();
});

var totalSymbols = 10;
var fly;
var flies = [];

// var testPath = new Path();
// testPath.strokeColor = 'black';
// function onFrame(event) {
// 	var y = view.size.height*(1-levyWalk());
// 	var x = event.count*5;
// 	testPath.add(new Point(x, y));
// }

function init() {
	// console.log('in init()');
	flyBase.bounds.width = 10;
	flyBase.bounds.height= 10;
	flyBase.position = view.size/2;
	// flyBase.fillColor = 'red';
	fly = new Symbol(flyBase);
	var openwindows = getWindows();
	openwindows++;
	setWindows(openwindows);
	window.onbeforeunload = function() {
		var windowsNow = getWindows();
		if(windowsNow >= 1)
			setWindows(windowsNow--);
	}

	for(var i=0;i<totalSymbols*openwindows;i++) {
		var position = view.size * Point.random();
		var placed = fly.place(position);
		placed.direction = placed.position.clone().normalize();
		placed.direction.angle = Math.random()*70;
		flies.push(placed);
	}

	view.on('frame', function() {
		for(var i in flies) {
			var _fly = flies[i];
			// _fly.direction.angle += (levyWalk()*180 - 90);
			// _fly.direction.length = levyWalk()*20;
			var rand = levyWalk();
			if (rand >= 0.5) {
				_fly.direction.angle += rand*90;
				_fly.direction.length  = rand*40;
			}
			else {
				_fly.direction.length = rand*30;
			}
			_fly.position += _fly.direction;

			if(_fly.bounds.right > view.bounds.right) {
				_fly.position.x -= _fly.direction.x * 2;
				_fly.direction.x *= -1;
			}
			if(_fly.bounds.left < view.bounds.left) {
				_fly.position.x -= _fly.direction.x * 2;
				_fly.direction.x *= -1;
			}
			if(_fly.bounds.bottom > view.bounds.bottom) {
				_fly.position.y -= _fly.direction.y * 2;
				_fly.direction.y *= -1;
			}
			if(_fly.bounds.top < view.bounds.top) {
				_fly.position.y -= _fly.direction.y * 2;
				_fly.direction.y *= -1;
			}
		}
		fly.definition.rotate(Math.random()*180);
	});
	// var v = fly.position.clone();
	// v *= 1.3;
	// v = v - fly.position;
	// console.log(v, v.length, v.angle);
}


function levyWalk() {
	while(true) {
		var r1 = Math.random();
		var r2 = Math.random();
		var r3 = Math.random();
		var r4 = Math.random();
		if(r2 > r1)
			// return r1; //from original gist, I wanted it more restrictive so I added the below:
			if(r3 > r2)
				if(r4 > r3)
					return r1;
	}
}

function onMouseDown(event) {
	var circle = new Shape.Circle({
		center: event.point,
		radius: 100
		//fillColor: 'black'
	});
	for (var i in flies) {
		if(circle.bounds.intersects(flies[i].bounds)) {
			var d = flies[i].position - event.point;
			d.length = circle.radius;
			// d.length *= Math.random()*3;
			flies[i].position += d;
			if(!view.bounds.contains(flies[i].bounds)) {
				d.angle += 180;
				d.length *= 2;
				flies[i].position += d;
			}
		}
	}
	circle.removeOnUp();
}

function getCookie(key) {
	if(document.cookie.indexOf(key) >= 0) {
		var cookies = document.cookie.split('; ');
		// console.log('cookies', cookies);
		for(var i in cookies) {
			var cookie = cookies[i].split('=');
			// console.log('cookie', cookie);
			if(cookie[0] == key) {
				return cookie[1];
			}
		}
	}
	else
		return null;
	
}

function getWindows() {
	// console.log('getcookies', getCookie('openwindows'));
	var result = parseInt(getCookie('openwindows'));
	// console.log(result);
	if(!result)
		result = 0;
	return result;
}

function setWindows(value) {
	document.cookie = 'openwindows='+ value;
}

function onResize(event) {
	var position;
	for(var i in flies) {
		position = view.size * Point.random();
		flies[i].position = position;
	}
}




