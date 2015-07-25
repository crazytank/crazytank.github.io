var w = 960;
var h = 640;
var scaleX = window.innerWidth / w;
var scaleY = window.innerHeight / h;
var scale = Math.min(scaleX, scaleY);
var ww = w * scale;
var hh = h * scale;
var offsetX = ((window.innerWidth - ww) / 2);
var offsetY = ((window.innerHeight - hh) / 2);
var cursorX = -100;
var cursorY = -100;
var stage = document.getElementById('enchant-stage');
stage.style.position = 'absolute';
stage.style.left =  offsetX + 'px';
stage.style.top = offsetY + 'px';
document.body.style.overflow = "hidden";
var roomName;
var playerName;
var socket;
var scene;
var mapT;
var aim;
var player;
var enemies = [];
var enemyBullets = [];
var startGame = false;
var die = false;
var ping;
var pong;

enchant();

document.onmousemove = function(e) {
    cursorX = (e.pageX - offsetX)/scale;
    cursorY = (e.pageY - offsetY)/scale;
}

document.onkeypress = function (e) {
    e = e || window.event;
    //if (e.keyCode === 13) overlay();
}

function resize() {
    offsetX = ((window.innerWidth - ww) / 2);
    offsetY = ((window.innerHeight - hh) / 2);
    var stage = document.getElementById('enchant-stage');
    stage.style.position = 'absolute';
    stage.style.left =  offsetX + 'px';
    stage.style.top = offsetY + 'px';
}

function myGame(name, room) {
    playerName = name;
    roomName = room;

    var game = new Core(w, h); game.fps = 60; game.scale = scale;

    game.keybind(81, 'left');
    game.keybind(68, 'right');
    game.keybind(90, 'up');
    game.keybind(83, 'down');

    game.preload('bullet.png',
                 'aim-32.png',
                 'tankGreen.png',
                 'barrelGreen.png',
                 'life.png',
                 'trackup.png',
                 'trackdown.png',
                 'effect0.png',
                 'tile.svg');

    window.addEventListener('resize', function() { resize() }, true);

    game.onload = function () {
        //game.rootScene.backgroundColor = "#afe7fa";
        game.rootScene.backgroundColor = "#eeeeee";
        game.pushScene(makeGameScene());
    };
    
    game.start();

    function makeGameScene() {
        scene = new Scene();
        socket.emit('join', {room: roomName, name: playerName});
        ping = Date.now();
        socket.emit('ping');

        mapT = [
                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [0, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1,  0, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  0,  0,  0, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1,  0,  0, -1, -1,  0],
                [0, -1, -1,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0,  0,  0,  0, -1, -1,  0, -1, -1, -1, -1, -1,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  0, -1, -1,  0,  0,  0],
                [0, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1,  0, -1, -1, -1,  0, -1, -1,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1,  0],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1,  0],
                [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
               ];

        var map = new Map(32, 32);        
        map.image = game.assets['tile.svg']; 
        map.loadData(mapT);
        map.collisionData = [
                             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                             [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
                             [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
                             [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                            ];
        scene.addChild(map);
        map.collide = function(x, y){
            var w = map._tileWidth;
            var h = map._tileHeight;
            var xx = Math.floor(x / map._tileWidth);
            var yy = Math.floor(y / map._tileHeight);
            var tx = x % map._tileWidth;
            var ty = y % map._tileHeight;
            var cx = x + w/2;
            var cy = y + h/2;

            if (mapT[yy][xx] === 0) { 
                var cxx = xx*w + w/2;
                var cyy = yy*h + h/2;
                var d = Math.sqrt((cx - cxx)*(cx - cxx) + (cy - cyy)*(cy - cyy));
                if(d < w) return true;
            }
            if (tx > 0 && ty > 0) if (mapT[yy + 1][xx + 1] === 0) {
                var cxx = (xx + 1) * w + w/2;
                var cyy = (yy + 1) * h + h/2;
                var d = Math.sqrt((cx - cxx)*(cx - cxx) + (cy - cyy)*(cy - cyy));
                if(d < w) return true;
            }
            if (tx > 0) if (mapT[yy][xx + 1] === 0) {
                var cxx = (xx + 1) * w + w/2;
                var cyy = yy*h + h/2;
                var d = Math.sqrt((cx - cxx)*(cx - cxx) + (cy - cyy)*(cy - cyy));
                if(d < w) return true;
            }
            if (ty > 0) if (mapT[yy + 1][xx] === 0) {
                var cxx = xx*w + w/2;
                var cyy = (yy + 1) * h + h/2;
                var d = Math.sqrt((cx - cxx)*(cx - cxx) + (cy - cyy)*(cy - cyy));
                if(d < w) return true;
            }
            return false;
        }

        function bulletHitMap(x, y){
            var xx = Math.floor(x / map._tileWidth);
            var yy = Math.floor(y / map._tileHeight);
            if (mapT[yy][xx] === 0) return true;
            else return false;
        }

	var label = new Label("Click to Respawn");
        label.color = 'rgb(0, 255, 0)';
        label.font = 'bold 22px sans-serif';

        var Aim = Class.create(Sprite, {
            initialize: function(){
                Sprite.call(this, 32, 32);
                this.image = game.assets['aim-32.png'];
                this.x = -100;
                this.y = -100;
                this.addEventListener(Event.ENTER_FRAME, function() {
                    this.x = cursorX - this.width / 2;
                    this.y = cursorY - this.height / 2;
                });
            }
        })
        aim = new Aim; scene.addChild(aim);

        var Turret = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 36, 36);
                this.image = game.assets['barrelGreen.png'];
                this.x = x;
                this.y = y;
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.rotation = 0;
            }
        });

        var Life = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 54, 54);
                this.image = game.assets['life.png'];
                this.x = x;
                this.y = y;
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.rotation = 0;
                this.frame = 0;
            }
        });

        var Track = Class.create(Sprite, {
            initialize: function(x, y, rotation, type) {
                Sprite.call(this, 32, 32);
                this.image = type ? game.assets['trackup.png'] : game.assets['trackdown.png'];
                this.x = x;
                this.y = y;
                this.rotation = rotation;
                this.time = Date.now();
            }
        });

        var Player = Class.create(Sprite, {
            initialize: function(x, y) {
                Sprite.call(this, 32, 32);
                this.image = game.assets['tankGreen.png'];
                this.x = x;
                this.y = y;
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.speed = 2;
                this.rotation = 0;
                this.blood = 0;
                this.r = this.width / 2;
                this.d = Math.sqrt(this.width * this.width / 4 + this.height * this.height / 4);
                this.bullets = [];
                this.tracks = [];
                this.turret = new Turret(this.x, this.y);
                this.turret.x = this.x - (this.turret.width - this.width) / 2;
                this.turret.y = this.y - (this.turret.height - this.height) / 2;
                this.life = new Life(this.x, this.y);
                this.life.x = this.x - (this.life.width - this.width) / 2;
                this.life.y = this.y - (this.life.height - this.height) / 2;
            },           
            respawn: function(x, y) {
                this.x = x;
                this.y = y;
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.rotation = 0;
                this.blood = 0;
                this.turret.x = this.x - (this.turret.width - this.width) / 2;
                this.turret.y = this.y - (this.turret.height - this.height) / 2;
                this.turret.centerX = this.turret.x + this.turret.width / 2;
                this.turret.centerY = this.turret.y + this.turret.height / 2;
                this.turret.rotation = 0;
                this.life.x = this.x - (this.life.width - this.width) / 2;
                this.life.y = this.y - (this.life.height - this.height) / 2;
                this.life.rotation = 0;
                this.life.frame = 0;
            },           
            update: function() {
                var changed = false;
                var c = {up: false, down: false, right: false, left: false, angle: this.turret.rotation}; 
                if (game.input.right) { c.right = changed = true; this.rotation += 5; this.life.rotation = this.rotation }
                else if (game.input.left) { c.left = changed = true; this.rotation -= 5; this.life.rotation = this.rotation }
                if (game.input.down) {
                    var x = this.x - Math.cos((this.rotation - 90) * Math.PI / 180) * this.speed;
                    var y = this.y - Math.sin((this.rotation - 90) * Math.PI / 180) * this.speed;
                    if (this.collide(x, y).length < 1 && !map.collide(x, y)) {
                        c.down = changed = true;
                        this.x = x;
                        this.y = y;
                        this.centerX = this.x + this.width / 2;
                        this.centerY = this.y + this.height / 2;
                        this.turret.x = this.x - (this.turret.width - this.width) / 2;
                        this.turret.y = this.y - (this.turret.height - this.height) / 2;
                        this.turret.centerX = this.turret.x + this.turret.width / 2;
                        this.turret.centerY = this.turret.y + this.turret.height / 2;
                        this.life.x = this.x - (this.life.width - this.width) / 2;
                        this.life.y = this.y - (this.life.height - this.height) / 2;
                    }    
                } else if (game.input.up) {
                    var x = this.x + Math.cos((this.rotation - 90) * Math.PI / 180) * this.speed;
                    var y = this.y + Math.sin((this.rotation - 90) * Math.PI / 180) * this.speed;
                    if (this.collide(x, y).length < 1 && !map.collide(x, y)) {
                        c.up = changed = true;
                        this.x = x;
                        this.y = y;
                        this.centerX = this.x + this.width / 2;
                        this.centerY = this.y + this.height / 2;
                        this.turret.x = this.x - (this.turret.width - this.width) / 2;
                        this.turret.y = this.y - (this.turret.height - this.height) / 2;
                        this.turret.centerX = this.turret.x + this.turret.width / 2;
                        this.turret.centerY = this.turret.y + this.turret.height / 2;
                        this.life.x = this.x - (this.life.width - this.width) / 2;
                        this.life.y = this.y - (this.life.height - this.height) / 2;
                    }
                }
                if (cursorX != -100 && cursorY != -100) {
                    var rotation = Math.atan2(this.turret.centerY - cursorY, this.turret.centerX - cursorX) * 180 / Math.PI - 90;
                    if (this.turret.rotation.toFixed(14) !== rotation.toFixed(14)) {
                        this.turret.rotation = rotation;
                        c.rotation = this.turret.rotation;
                        changed = true; 
                    }
                } else { this.turret.rotation = this.rotation }
                if (changed) socket.emit('sync', c);
                var type = 0;
                if (c.up) type = 1;
                if (!die && this.tracks.length == 0 && (c.up || c.down)) {
                    var track = new Track(this.x, this.y, this.rotation, type);
                    scene.addChild(track);
                    this.tracks.push(track);
                } else if (!die && this.tracks.length != 0 && (c.up || c.down)) {
                    var d = Math.sqrt((this.x - this.tracks[this.tracks.length-1].x)*(this.x - this.tracks[this.tracks.length-1].x)
                            + (this.y - this.tracks[this.tracks.length-1].y)*(this.y - this.tracks[this.tracks.length-1].y));
                    if( d > 6) {
                        var track = new Track(this.x, this.y, this.rotation, type);
                        scene.addChild(track);
                        this.tracks.push(track);
                    }
                }
                if (this.tracks.length > 0) {
                    if(this.tracks.length >= 3 || (!c.up && !c.down)) {
                        scene.removeChild(this.tracks[0]);
                        this.tracks.splice(0, 1);
                    }
                }
            },
            collide: function(x, y) {
                cx = x + this.width / 2;
                cy = y + this.height / 2;
                var ret = [];
                var c;
                for (var i = 0, l = Enemy.collection.length; i < l; i++) {
                    c = Enemy.collection[i];
                    var d = Math.sqrt((cx - c.centerX)*(cx - c.centerX) + (cy - c.centerY)*(cy - c.centerY))
                    if (d <= (this.r + c.r)) {
                        ret.push([c]);
                    }
                }
                return ret;
            },
            damage: function() {
                if (this.blood === 3) {
                    scene.removeChild(this.life);
                    scene.removeChild(this.turret);
                    scene.removeChild(this);
                    for (var i=0;  i < this.tracks.length; i++) scene.removeChild(this.tracks[i]);
                    scene.addChild(new Explosion(this.x, this.y));
                    die = true;
                    aim.visible = false;
                    label.x = window.innerWidth/2;
                    label.y = window.innerHeight/2;        
                    scene.addChild(label);
                } else {
                    this.blood ++;
                    this.life.frame = this.blood;
                }
            }
        });

        var Enemy = Class.create(Sprite, {
            initialize: function(x, y) {
                Sprite.call(this, 32, 32);
                this.image = game.assets['tankGreen.png'];
                this.x = x;
                this.y = y;
                this.speed = 4;
                this.rotation = 0;
                this.blood = 0;
                this.r = this.width / 2;
                this.d = Math.sqrt(this.width * this.width / 4 + this.height * this.height / 4);
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.turret = new Turret(this.x, this.y);
                this.turret.x = this.x - (this.turret.width - this.width) / 2;
                this.turret.y = this.y - (this.turret.height - this.height) / 2;
                this.life = new Life(this.x, this.y);
                this.life.x = this.x - (this.life.width - this.width) / 2;
                this.life.y = this.y - (this.life.height - this.height) / 2;

            },
            respawn: function(x, y) {
                this.x = x;
                this.y = y;
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.rotation = 0;
                this.blood = 0;
                this.turret.x = this.x - (this.turret.width - this.width) / 2;
                this.turret.y = this.y - (this.turret.height - this.height) / 2;
                this.turret.centerX = this.turret.x + this.turret.width / 2;
                this.turret.centerY = this.turret.y + this.turret.height / 2;
                this.turret.rotation = 0;
                this.life.x = this.x - (this.life.width - this.width) / 2;
                this.life.y = this.y - (this.life.height - this.height) / 2;
                this.life.frame = 0;
                this.life.rotation = 0;
            },           
            update: function (data) {
                this.x = data.x;
                this.y = data.y;
                this.rotation = data.rotation;
                this.turret.x = this.x - (this.turret.width - this.width) / 2;
                this.turret.y = this.y - (this.turret.height - this.height) / 2;
                this.turret.rotation = data.angle;
                this.centerX = this.x + this.width / 2;
                this.centerY = this.y + this.height / 2;
                this.turret.centerX = this.turret.x + this.turret.width / 2;
                this.turret.centerY = this.turret.y + this.turret.height / 2;
                this.life.x = this.x - (this.life.width - this.width) / 2;
                this.life.y = this.y - (this.life.height - this.height) / 2;
                this.life.rotation = this.rotation;
            },
            damage: function() {
                if (this.blood === 3) {
                    scene.removeChild(this.life);
                    scene.removeChild(this.turret);
                    scene.removeChild(this);
                    scene.addChild(new Explosion(this.x, this.y));
                } else {
                    this.blood ++;
                    this.life.frame = this.blood;
                }
            }
        });

        var Bullet = Class.create(Sprite, {
            initialize: function(id, obj, angle){
                Sprite.call(this, 6, 10);
                this.image = game.assets['bullet.png'];
                this.time = Date.now();
                this.id = id;
                this.x = obj.x + (obj.width - this.width) / 2 + obj.width / 2 * Math.cos((obj.rotation - 90) * Math.PI / 180);
                this.y = obj.y + (obj.height - this.height) / 2 + obj.height / 2 * Math.sin((obj.rotation - 90)* Math.PI / 180);
                this.speed = 10;
                this.angle = angle;
                this.rotation = angle / Math.PI * 180 + 90;
                this.addEventListener(Event.ENTER_FRAME, function() {
                    this.x += this.speed * Math.cos(this.angle);
                    this.y += this.speed * Math.sin(this.angle);
                });
            }
        });
        
        var BulletEnemy = Class.create(Sprite, {
            initialize: function(obj, angle){
                Sprite.call(this, 6, 10);
                this.image = game.assets['bullet.png'];
                this.time = Date.now();
                this.x = obj.x + (obj.width - this.width) / 2 + obj.width / 2 * Math.cos((obj.rotation - 90) * Math.PI / 180);
                this.y = obj.y + (obj.height - this.height) / 2 + obj.height / 2 * Math.sin((obj.rotation - 90)* Math.PI / 180);
                this.speed = 10;
                this.angle = angle;
                this.rotation = angle / Math.PI * 180 + 90;
                this.addEventListener(Event.ENTER_FRAME, function() {
                    this.x += this.speed * Math.cos(this.angle);
                    this.y += this.speed * Math.sin(this.angle);
                });
            },
            update: function(t) {
                var l = Math.floor(t/(1000/game.fps));
                for (var i = 0; i < l; i++) {
                    this.x += this.speed * Math.cos(this.angle);
                    this.y += this.speed * Math.sin(this.angle);
                    //var d = Math.sqrt((this.x - player.centerX)*(this.x - player.centerX) + (this.y - player.centerY)*(this.y - player.centerY))
                    //if (d <= (this.width + player.r)) {
                    //    player.damage();
                    //    return true;
                    //}                    
                    if (bulletHitMap(this.x, this.y)) {this.visible = false; return};
                }
            }
        });

        var Explosion = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 32, 32);
                this.image = game.assets['effect0.png'];
                this.x = x;
                this.y = y;
		this.duration = 48;
                this.addEventListener(Event.ENTER_FRAME,  function() {
                    this.frame = Math.floor(this.age / this.duration * 5)
                    if(this.age === this.duration) scene.removeChild(this);
                });
            }
        });

        scene.addEventListener(Event.TOUCH_START, function (e) {
            if (die) {
                socket.emit('die');
                scene.removeChild(label);
            } else {
                if (startGame === true) {
                    if (player.bullets.length === 0 
                        || (player.bullets.length > 0 && player.bullets[player.bullets.length-1].time < Date.now() - 500)) {
                        var angle = Math.atan2(cursorY - player.turret.centerY, cursorX - player.turret.centerX);
                        var id = Math.random().toString(36).substring(2);
                        socket.emit('bullet', {uid: id, angle: angle});
                        var bullet = new Bullet(id, player.turret, angle);
                        scene.addChild(bullet);
                        player.bullets.push(bullet);
                    } 
                }
            }
        });

        scene.addEventListener('enterframe', function (event) {

            var hits = [];
/*
            hits = BulletEnemy.intersect(Enemy);
            for(var i = 0, len = hits.length; i < len; i++){
                if (hits[i][0].id !== hits[i][1].id) {
		    scene.removeChild(hits[i][0]);
                    enemyBullets.splice(enemyBullets.map(function(x) {return x.id; }).indexOf(hits[i][0].id), 1);
                    hits[i][1].damage();
                }
            }
*/
/*
            hits = [];
            hits = Bullet.intersect(Enemy);
            for(var i = 0, len = hits.length; i < len; i++){
                socket.emit('damage', {bid: hits[i][0].id, eid: hits[i][1].id});
		//scene.removeChild(hits[i][0]);
                //player.bullets.splice(player.bullets.map(function(x) {return x.id; }).indexOf(hits[i][0].id), 1);
		//hits[i][1].damage();
            }
*/
            if (startGame) { 
                player.update();
                for (var i = 0; i < player.bullets.length; i++) {
                    if (bulletHitMap(player.bullets[i].x, player.bullets[i].y)) {
                        scene.removeChild(player.bullets[i]);
                        player.bullets.splice(i, 1);
                    }
                }
/*
                var hits = Player.intersect(BulletEnemy);
                for(var i = 0, len = hits.length; i < len; i++){
	    	    scene.removeChild(hits[i][1]);
                    enemyBullets.splice(enemyBullets.map(function(x) {return x.id; }).indexOf(hits[i][1].id), 1);
                    hits[i][0].damage();
                }
*/
            }
/*
            hits = [];
            hits = Bullet.intersect(BulletEnemy);
            for(var i = 0, len = hits.length; i < len; i++){
		scene.removeChild(hits[i][0]);
		scene.removeChild(hits[i][1]);
                player.bullets.splice(player.bullets.map(function(x) {return x.id; }).indexOf(hits[i][0].id), 1);
                enemyBullets.splice(enemyBullets.map(function(x) {return x.id; }).indexOf(hits[i][1].id), 1);
            }
*/
            for (var i = 0; i < enemyBullets.length; i++) {
                if (bulletHitMap(enemyBullets[i].x, enemyBullets[i].y) || !enemyBullets[i].visible) {
                    scene.removeChild(enemyBullets[i]);
                    enemyBullets.splice(i, 1);
                }
            }

        });

setInterval(function() {
        ping = Date.now();
        socket.emit('ping');
}, 30000);
setTimeout(function(){ ping = Date.now(); socket.emit('ping') }, 1000);

socket.on('pong', function() {
    pong = (Date.now() - ping) / 2;
});
 
socket.on('ping', function() {
    socket.emit('pong');
});
        
socket.on('start', function(data, players) {
    for (var i = 0; i < players.length; i++) add(players[i]);
    start(data);
});

socket.on('join', function(data) {
    add(data);
});

socket.on('del', function(data) {
    del(data);
});

socket.on('sync', function(data) {
    movePlayer(data);
});

socket.on('bullet', function(data) {
    addBullet(data);
});

socket.on('respawn', function(data) {
    respawn(data);
});

socket.on('rejoin', function(data) {
    rejoin(data);
});

socket.on('damage', function(data) {
    var bindex = player.bullets.map(function(x) {return x.id}).indexOf(data.bid);
    var eindex = enemies.map(function(x) {return x.id}).indexOf(data.eid);
    scene.removeChild(player.bullets[bindex]);
    player.bullets.splice(bindex, 1);
    enemies[eindex].damage();
});

socket.on('ondamage', function(data) {
    var bindex = enemyBullets.map(function(x) {return x.uid}).indexOf(data.uid);
    scene.removeChild(enemyBullets[bindex]);
    enemyBullets.splice(bindex, 1);
    var index = enemies.map(function(x) {return x.id; }).indexOf(data.eid);
    if (index < 0) {
        player.damage();
    } else {
        enemies[index].damage();
    }
});

socket.on('disconnected', function() {
    socket.emit('disconnect');
});

function start(data) {
    player = new Player(data.x, data.y);
    startGame = true;
    scene.addChild(player);
    scene.addChild(player.turret);
    scene.addChild(player.life);
}

function add(data) {
    var enemy = new Enemy(data.x, data.y);
    enemy.update(data);
    enemy.id = data.id
    enemies.push(enemy);
    scene.addChild(enemy);
    scene.addChild(enemy.turret);
    scene.addChild(enemy.life);
}

function respawn(data) {
    player.respawn(data.x, data.y);
    scene.addChild(player);
    scene.addChild(player.turret);
    scene.addChild(player.life);
    aim.visible = true;
    die = false;
}

function rejoin(data) {
    var index = enemies.map(function(x) {return x.id; }).indexOf(data.id);
    enemies[index].respawn(data.x, data.y);
    scene.addChild(enemies[index]);
    scene.addChild(enemies[index].turret);
    scene.addChild(enemies[index].life);
}

function del(id) {
    var index = enemies.map(function(x) {return x.id; }).indexOf(id);
    scene.removeChild(enemies[index]);
    scene.removeChild(enemies[index].turret);
    scene.removeChild(enemies[index].life);
    enemies.splice(index, 1);
}

function movePlayer(data) {
    var index = enemies.map(function(x) {return x.id; }).indexOf(data.id);
    enemies[index].update(data);
}

function addBullet(data) {
    var index = enemies.map(function(x) {return x.id; }).indexOf(data.id);
    var bullet = new BulletEnemy(enemies[index].turret, data.angle);
    //if (!bullet.update((data.pong + pong))) {
    bullet.uid = data.id + data.uid;  
    enemyBullets.push(bullet);
    scene.addChild(bullet);
    //}
    bullet.update((data.pong + pong))
}

        return scene;
    }
}
