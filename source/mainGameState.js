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
    this.game.load.image("asteroid-small-01", "assets/images/asteroid-small-01.png");
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
    
    // add asteroid timer
    this.asteroidTimer = 2.0;
    // create group
    this.asteroids = game.add.group();
    
    // keep track of which arrow keys the user has pressed down
    this.cursors = game.input.keyboard.createCursorKeys();
    
    // put this in a seperate function? ______________________________________________________
    // coordinates for spaceShip
    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;
    // add spaceShip
    this.playerShip = game.add.sprite(shipX, shipY, "player-ship");
    this.playerShip.anchor.setTo(0.5, 0.5);
    // allow Phaser physics system to controle the playership
    game.physics.arcade.enable(this.playerShip);
    // _______________________________________________________________________________________
}

// Add the update function
mainGameState.update = function() {
    mainGameState.updatePlayer();
    
    this.asteroidTimer -= game.time.physicsElapsed;
    
    if( this.asteroidTimer <= 0.0 ) {
    // prints just to check that the timer works
        console.log("SPAWN ASTEROID");
        mainGameState.spawnAsteroid();
        this.asteroidTimer = 2.0;
    }
    
    // clean up any asteroids that have moved off the bottom of the screen
    for( var i = 0; i < this.asteroids.children.length; i++ ) {
        if( this.asteroids.children[i].y > (game.height + 200) ) {
            this.asteroids.children[i].destroy();
        }
    }
}

mainGameState.updatePlayer = function() {
    // check whether a specific key  is pressed down
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
    // here
    var asteroid = game.add.sprite(x, 0, "asteroid-small-01");
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