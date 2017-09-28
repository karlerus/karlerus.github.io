// Create an empty object
var mainGameState = { }
var ship_velocity = 200;
var asteroid_velocity_min = 100;
var asteroid_velocity_max = 250;
var asteroid_angular_min = 50;
var asteroid_angular_max = 150;

// Add the preload function
mainGameState.preload = function() { 
    console.log("Pre-loading the Game");
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("player-ship", "assets/images/player-ship.png");
    this.game.load.audio("bg_music", "assets/audio/bg_music.mp3");
    // asteroid types
    this.game.load.image("asteroid-small-01", "assets/images/asteroid-small-01.png");
    this.game.load.image("asteroid-small-02", "assets/images/asteroid-small-02.png");
    this.game.load.image("asteroid-medium-01", "assets/images/asteroid-medium-01.png");
    this.game.load.image("asteroid-medium-02", "assets/images/asteroid-medium-02.png");
    // bullet types
    this.game.load.image("bullet-fire", "assets/images/bullet-fire.png");
    this.game.load.image("bullet-laser", "assets/images/bullet-laser.png");
    this.game.load.image("bullet-plasma", "assets/images/bullet-plasma.png");
    this.game.load.image("bullet-simple", "assets/images/bullet-simple.png");
    this.game.load.image("bullet-swarm", "assets/images/bullet-swarm.png");
    this.game.load.audio("player_fire_01", "assets/audio/player_fire_01.mp3");
    this.game.load.audio("player_fire_02", "assets/audio/player_fire_02.mp3");
    this.game.load.audio("player_fire_03", "assets/audio/player_fire_03.mp3");
    this.game.load.audio("player_fire_04", "assets/audio/player_fire_04.mp3");
    this.game.load.audio("player_fire_05", "assets/audio/player_fire_05.mp3");
    this.game.load.audio("player_fire_06", "assets/audio/player_fire_06.mp3");
}

// Add the create function
mainGameState.create = function() { 
    // used to initialize the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // add background
    game.add.sprite(0,0, "space-bg");
    
    // add music
    this.music = game.add.audio("bg_music")
    this.music.play();
    this.music.volume = 1;
    this.music.loop = true;
        
    // Add this to your create function to add the sound effect to your world
    // Note that it will not play until you tell it to play later
    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio("player_fire_01"));
    this.playerFireSfx.push(game.add.audio("player_fire_02"));
    this.playerFireSfx.push(game.add.audio("player_fire_03"));
    this.playerFireSfx.push(game.add.audio("player_fire_04"));
    this.playerFireSfx.push(game.add.audio("player_fire_05"));
    this.playerFireSfx.push(game.add.audio("player_fire_06"));
    
    // add asteroid timer
    this.asteroidTimer = 2.0;
    // add bullet timer
    this.bulletTimer = 0.4;
    
    // create asteroid group
    this.asteroids = game.add.group();
    // create bullet group
    this.playerBullets = game.add.group();
    
    // keep track of which arrow keys the user has pressed down
    this.cursors = game.input.keyboard.createCursorKeys();
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    
    // add a score variable
    var textStyle = {font: "14px Arial", fill: "#ccddff", align: "center"}
    
    this.scoreTitle = game.add.text(game.width * 0.9, 20, "SCORE", textStyle);
    this.scoreTitle.fixedToCamera = true;
    this.scoreTitle.anchor.setTo(0.5, 0.5);
    
    this.scoreValue = game.add.text(game.width * 0.9, 40, "0", textStyle);
    this.scoreValue.fixedToCamera = true;
    this.scoreValue.anchor.setTo(0.5, 0.5);
    
    this.playerScore = 0;
    
    // put this in a seperate function?________________________________________
    // coordinates for spaceShip
    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;
    // add spaceShip
    this.playerShip = game.add.sprite(shipX, shipY, "player-ship");
    this.playerShip.anchor.setTo(0.5, 0.5);
    // allow Phaser physics system to controle the playership
    game.physics.arcade.enable(this.playerShip);
    // ___________________________________________________________________________
}

// Add the update function
mainGameState.update = function() {
    mainGameState.updatePlayer();
    
    this.asteroidTimer -= game.time.physicsElapsed;
    

    if( this.asteroidTimer <= 0.0 ) {
    // prints just to check that the timer works
        //console.log("SPAWN ASTEROID");
        mainGameState.spawnAsteroid();
        this.asteroidTimer = 2.0;
    }
    
    if( this.fireKey.isDown ) {
    //console.log("FIRE KEY PRESSED")
        this.spawnPlayerBullet();
    }
    
    this.bulletTimer -= game.time.physicsElapsed;
    
    // update score
    this.scoreValue.setText(this.playerScore);
    
    // collision 
   game.physics.arcade.collide(this.asteroids, this.playerBullets, mainGameState.onAsteroidBulletCollision, null, this);
    
    // clean up any asteroids that have moved off the bottom of the screen
    for( var i = 0; i < this.asteroids.children.length; i++ ) {
        if( this.asteroids.children[i].y > (game.height + 200) ) {
            this.asteroids.children[i].destroy();
        }
    }
    // clean up any bullets that have moves off the top of the screen
    for( var i = 0; i < this.playerBullets.children.length; i++ ) {
        if( this.playerBullets.children[i].y < -200 ) {
            this.playerBullets.children[i].destroy();
        }
    }
}

mainGameState.updatePlayer = function() {
    // check whether a specific key is pressed down
    if ( this.cursors.left.isDown ) {
    // set the velocity of a sprite using the following property
        this.playerShip.body.velocity.x = -ship_velocity;
    } else if ( this.cursors.right.isDown ) {
        this.playerShip.body.velocity.x = ship_velocity;
    } else {
        this.playerShip.body.velocity.x = 0;
    }
    
    // prevent the ship from moving outside the screen
    if ((this.playerShip.x > game.width) && (this.playerShip.body.velocity.x > 0)) {
        this.playerShip.body.velocity.x = 0;
    }
    if ((this.playerShip.x < 0) && (this.playerShip.body.velocity.x < 0)) {
        this.playerShip.body.velocity.x = 0;
    }
}

mainGameState.spawnAsteroid = function() {
    // setup and create asteroid
    
    // set the x position to a random value
    var x = game.rnd.integerInRange(0, game.width);
    // set the asteroid type
    var asteroid_types = ["asteroid-small-01", "asteroid-small-02", "asteroid-medium-01", "asteroid-medium-02"];
    var index = game.rnd.integerInRange(0, asteroid_types.length-1);
    
    var asteroid = game.add.sprite(x, 0, asteroid_types[index]); 
    asteroid.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(asteroid);
    // set the velocity of the asteroid
    var asteroid_velocity = game.rnd.integerInRange(asteroid_velocity_min, asteroid_velocity_max);
    
    asteroid.body.velocity.setTo(0, asteroid_velocity);
    var asteroid_angular = game.rnd.integerInRange(asteroid_angular_min, asteroid_angular_max);
    asteroid.body.angularVelocity = asteroid_angular;
    
    // add to the asteroid group
    this.asteroids.add(asteroid);
}

mainGameState.spawnPlayerBullet = function() {
    // set the bullet type
    var bullet_types = ["bullet-fire", "bullet-laser", "bullet-plasma", "bullet-simple", "bullet-swarm"];
    var index = game.rnd.integerInRange(0, bullet_types.length-1);
    
    if( this.bulletTimer < 0 ) {
        this.bulletTimer = 0.4;
        
        var bullet = game.add.sprite(this.playerShip.x, this.playerShip.y, bullet_types[index]);
        bullet.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(bullet);
        bullet.body.velocity.setTo(0, -200);
        
        var index = game.rnd.integerInRange(0, this.playerFireSfx.length - 1);
        this.playerFireSfx[index].play();
    
        // add to the playerBullets group
        this.playerBullets.add(bullet);
    }
    
}

mainGameState.onAsteroidBulletCollision = function(asteroid, bullet) {
    //console.log("COLLISION");
    asteroid.pendingDestroy = true;
    bullet.pendingDestroy = true;
    
    // increase player score
    this.playerScore += 50;
}