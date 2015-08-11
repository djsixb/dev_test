// Generated by CoffeeScript 1.7.1
(function() {
  var Bullet, HEIGHT, MainPlayer, WIDTH, animate, background, background_sprite, bullet_texture, bullets, main_player, moveDown, moveLeft, moveRight, moveUp, my_name, namespace, other_players, renderer, sendBullet, socket, stage, texture,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  WIDTH = 800;

  HEIGHT = 600;

  stage = new PIXI.Stage(0xFFFFAA);

  renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

  document.body.appendChild(renderer.view);

  texture = new PIXI.Texture.fromImage('img/bunny.png');

  background = new PIXI.Texture.fromImage('img/grass.png');

  bullet_texture = new PIXI.Texture.fromImage('img/bullet.png');

  other_players = {};

  bullets = {};

  namespace = "/game";

  my_name = "undefined :) ";

  socket = io.connect('http://' + document.domain + ':5000' + namespace);

  console.log('http://' + document.domain + ':5000' + namespace);

  background_sprite = new PIXI.Sprite(background);

  stage.addChild(background_sprite);

  main_player = void 0;

  Bullet = (function(_super) {
    __extends(Bullet, _super);

    function Bullet(texture) {
      this.texture = texture;
      Bullet.__super__.constructor.call(this, this.texture);
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
    }

    return Bullet;

  })(PIXI.Sprite);

  MainPlayer = (function(_super) {
    __extends(MainPlayer, _super);

    function MainPlayer(texture, player_name, c_stage) {
      this.texture = texture;
      this.player_name = player_name;
      this.c_stage = c_stage;
      MainPlayer.__super__.constructor.call(this, this.texture);
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
      this.direction = "right";
      this.speed = 4;
      this.r_speed = 0.09;
      this.r_limit = 0.3;
      this.position.x = WIDTH / 2;
      this.position.y = HEIGHT / 2;
      this.add_title();
      this.text.position.y = this.position.y - 40;
      this.text.position.x = this.position.x - 25;
      this.looking = "right";
    }

    MainPlayer.prototype.add_title = function() {
      var font;
      font = {
        font: "13.5px Tahoma",
        fill: "white"
      };
      this.text = new PIXI.Text(this.player_name, font);
      this.c_stage.addChild(this.text);
    };

    MainPlayer.prototype.set_player_name = function(new_name) {
      console.log(new_name);
      this.text.setText(new_name);
    };

    MainPlayer.prototype.animate = function() {
      if (this.rotation > this.r_limit) {
        this.direction = "right";
      } else if (this.rotation < -this.r_limit) {
        this.direction = "left";
      }
      this.text.position.y = this.position.y - 40;
      this.text.position.x = this.position.x - 25;
    };

    MainPlayer.prototype.rotate = function() {
      if (this.direction === "right") {
        this.rotation -= this.r_speed;
      } else if (this.direction === "left") {
        this.rotation += this.r_speed;
      }
    };

    return MainPlayer;

  })(PIXI.Sprite);

  socket.on('connect', function() {
    console.log("Connected");
    $("#status").text("Connected");
    socket.emit('iamonline', {
      data: "I'm connected!"
    });
  });

  socket.on('bullet-move', function(data) {
    var bullet;
    bullet = bullets[data.id];
    bullet.position.x = data.x;
    bullet.position.y = data.y;
  });

  socket.on('bullet-remove', function(data) {
    var bullet;
    bullet = bullets[data.id];
    stage.removeChild(bullet);
  });

  socket.on('move', function(data) {
    var player;
    player = other_players[data.id];
    player.position.x = data.x;
    player.position.y = data.y;
    player.rotate();
  });

  setInterval(function() {
    var startTime;
    startTime = Date.now();
    socket.emit('ping');
    socket.on('pong', function() {
      var latency;
      latency = Date.now() - startTime;
      $("#ping").text("Your ping: " + latency + " ms");
    });
  }, 750);

  socket.on('player_disconnected', function(id) {
    console.log("disconnected_player_id: " + id);
    stage.removeChild(other_players[id].text);
    stage.removeChild(other_players[id]);
  });

  socket.on('identifed', function(data) {
    var player;
    console.log("new player connected " + data.name);
    $("#status").text("identifed " + data.name);
    player = new MainPlayer(texture, data.name, stage);
    player.position.x = data.x;
    player.position.y = data.y;
    other_players[data.id] = player;
    main_player = data.id;
    stage.addChild(player);
  });

  socket.on('bullet', function(data) {
    var bullet;
    bullet = new Bullet(bullet_texture);
    bullet.position.x = data.x;
    bullet.position.y = data.y;
    bullets[data.id] = bullet;
    stage.addChild(bullet);
  });

  socket.on('newplayer', function(data) {
    var player;
    console.log("new player connected " + data.id);
    $("#status").text("new player connected " + data.id);
    if (main_player !== data.id) {
      player = new MainPlayer(texture, data.name, stage);
      player.position.x = data.x;
      player.position.y = data.y;
      other_players[data.id] = player;
      stage.addChild(player);
    }
  });

  moveUp = function() {
    socket.emit("move", {
      "action": "up",
      "id": main_player,
      "type": "player"
    });
  };

  moveDown = function() {
    socket.emit("move", {
      "action": "down",
      "id": main_player,
      "type": "player"
    });
  };

  moveLeft = function() {
    socket.emit("move", {
      "action": "left",
      "id": main_player,
      "type": "player"
    });
  };

  moveRight = function() {
    socket.emit("move", {
      "action": "right",
      "id": main_player,
      "type": "player"
    });
  };

  sendBullet = function() {
    socket.emit("new_bullet", {
      "direction": other_players[main_player].direction,
      "id": main_player
    });
  };

  kd.UP.down(moveUp);

  kd.DOWN.down(moveDown);

  kd.LEFT.down(moveLeft);

  kd.RIGHT.down(moveRight);

  kd.SPACE.down(sendBullet);

  animate = function() {
    var key;
    kd.tick();
    requestAnimFrame(animate);
    for (key in other_players) {
      other_players[key].animate();
    }
    renderer.render(stage);
  };

  requestAnimFrame(animate);

  return;

}).call(this);