// Create an empty object
var mainGameState = { }
    
// Add the preload function
mainGameState.preload = function() { 
    console.log("Pre-loading the Game");
    this.game.load.image("space-bg", "assets/images/space-bg.jpg");
    this.game.load.image("player-ship", "assets/images/player-ship.png");
}

// Add the create function
mainGameState.create = function() { 
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.add.sprite(0,0, "space-bg");
    
    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;
    
    // keep track of which arrow keys the user has pressed down
    this.cursors = game.input.keyboard.createCursorKeys();
    
    this.playerShip = game.add.sprite(shipX, shipY, "player-ship");
    this.playerShip.anchor.setTo(0.5, 0.5);
    // allow Phaser to controle the playership
    game.physics.arcade.enable(this.playerShip);
    
}

// Add the update function
mainGameState.update = function() { 
    if ( this.cursors.left.isDown ) {
        this.playerShip.body.velocity.x = -200;
    } else if ( this.cursors.right.isDown ) {
        this.playerShip.body.velocity.x = 200;
    } else {
        this.playerShip.body.velocity.x = 0;
    }
}