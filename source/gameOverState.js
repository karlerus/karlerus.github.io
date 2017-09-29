var gameOverState = {}

gameOverState.preload = function() {
    console.log("Pre-loading the GameOverScreen");
    this.game.load.image("bg", "assets/images/bg.png");
    this.game.load.image("dead", "assets/images/dead.png");
}

gameOverState.create = function() {
    // add background
    game.add.sprite(0,0, "bg");
    // add background music
    this.music = game.add.audio("pinkie-pie-make-a-wish")
    this.music.play();
    this.music.volume = 1;
    this.music.loop = true;  
    
    // add the GAME OVER pony
    this.gameOverPony = game.add.sprite(game.width * 0.5, 350, "dead");
    this.gameOverPony.anchor.setTo(0.5, 0.5);
    // add the GAME OVER meassage
    var textStyle = {font: "42px Arial", fill: "#000000", align: "center"}
    this.gameOverMessage = game.add.text(game.width * 0.5, 200, "GAME OVER", textStyle);
    this.gameOverMessage.fixedToCamera = true;
    this.gameOverMessage.anchor.setTo(0.5, 0.5);
}

gameOverState.update = function() {
    
    
}