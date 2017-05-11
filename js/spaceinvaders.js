/*
  spaceinvaders.js

  the core logic for the RayStorm game.

 */

/*  
    Game Class

    The Game class represents a RayStorm game.
    Create an instance of it, change any of the default values
    in the settings, and call 'start' to run the game.

    Call 'initialise' before 'start' to set the canvas the game
    will draw to.

    Call 'moveShip' or 'shipFire' to control the ship.

    Listen for 'gameWon' or 'gameLost' events to handle the game
    ending.
 */

//Creates an instance of the Game class.
function Game() {

	/******ATTRIBUTES******/

	//  Set the initial config.
	this.config = {
			bombRate: 0.05, // Number of bombs of the invaders.
			lightSaberRate: 0.01, // Number of bombs of the invaders.
			powerItemRate: 0.007, // Number of bombs of the invaders.
			shipShieldItemRate: 0.006, // Number of bombs of the invaders.
			bombMinVelocity: 50, // Velocity minimal of the bomb.
			bombMaxVelocity: 50, // Velocity maximal of the bomb.
			lightSaberMinVelocity: 50, // Velocity minimal of the bomb.
			lightSaberMaxVelocity: 50, // Velocity maximal of the bomb.
			invaderInitialVelocity: 25, // Velocity initial of the invader.
			invaderAcceleration: 0, // Acceleration of the invader.
			invaderDropDistance: 20, 
			rocketVelocity: 120, // Velocity of the rocket of the rayStorm.
			rocketMaxFireRate: 2, // Rate of the rocket of the ship.
			gameWidth: 400, // Width of the game.
			gameHeight: 300, // Height of the game.
			fps: 50, // Number of the fps.
			debugMode: false,
			invaderRanks: 5, // Number of rank of the invaders.
			invaderFiles: 10,
			shipSpeed: 120, // Speed of the ship.
			levelDifficultyMultiplier: 0.2, // Factor of difficulty for the level.
			pointsPerInvader: 5 // Number of points gained when ship destroys the invaders.
	};

	//  All state is in the variables below.
	this.lives = 3; // Number of lives for the ship.
	this.width = 0;
	this.height = 0;
	this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
	this.intervalId = 0;
	this.score = 0;
	this.level = 1;

	this.spaceShipPlayer = 'images/spaceship0.png';
	this.numberShip = 0;
	this.numberMaxShip = 40;
	//  The state stack.
	this.stateStack = [];

	//  Input/output
	this.pressedKeys = {};
	this.gameCanvas =  null;

	// vars for handling inputs
	this.inputStates = {};

	this.gamepad;

	this.isFireRocket = false;

	this.PressKeyToContinue = false;

	this.isPause = false;
	this.QuitPause = false;

	this.hasShield = false;
	this.shieldRed = false;

	//  All sounds.
	this.player;
	this.isMute = false;
//	this.sounds = null;

//	this.sourceSound;

//	this.playMusiqueGameOver = false;
	this.playmusic = false;

	//starfield Start or not
	this.starfieldStart = false;
	this.finishLoading = false;

	//Create the starfield.
	this.container;
	this.containerfps;
	this.starfield;

}

/******CLASS METHODS FOR GAME CLASS******/


//Initialis the Game with a canvas. Ie we set the viewport.
Game.prototype.initialise = function(gameCanvas) {

	//  Set the game canvas.
	this.gameCanvas = gameCanvas;

	//  Set the game width and height.
	this.width = gameCanvas.width;
	this.height = gameCanvas.height;

	//  Set the state game bounds.
	this.gameBounds = {
			left: gameCanvas.width / 2 - this.config.gameWidth / 2,
			right: gameCanvas.width / 2 + this.config.gameWidth / 2,
			top: gameCanvas.height / 2 - this.config.gameHeight / 2,
			bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
	};
};

Game.prototype.moveToState = function(state) {

	//  If we are in a state, leave it.
	if(this.currentState() && this.currentState().leave) {
		this.currentState().leave(game);
		this.stateStack.pop();
	}

	//  If there's an enter function for the new state, call it.
	if(state.enter) {
		state.enter(game);
	}

	//  Set the current state.
	this.stateStack.pop();
	this.stateStack.push(state);
};

//Returns the current state.
Game.prototype.currentState = function() {
	return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

//Start the Game.
Game.prototype.start = function() {

	//  Move into the 'welcome' state.
	this.moveToState(new LoadingGameChatState());

	//  Set the game variables.
	this.lives = 3; // We set the number of lives to three.
	this.config.debugMode = /debug=true/.test(window.location.href);

	//  Start the game loop.
	var game = this;
	//The main loop.
	var animationLoop = function GameLoop(time) {
		// First, get the current game state.
		var currentState = game.currentState();
		// Now work out how much time is in one 'tick' of the loop. This is one over the FPS - if we loop ten times per second, each tick is 100 milliseconds.
		if(currentState) {
			// gamepad
			updateGamePadStatus();

			//  Delta t is the time to update/draw.
			var dt = 1 / game.config.fps;

			//  Get a drawing context from the canvas.
			var ctx = this.gameCanvas.getContext("2d");

			//  Update if we have an update function in the current state. Also draw
			//  if we have a draw function in the current state.
			if(currentState.update) {
				currentState.update(game, dt);
			}
			if(currentState.draw) {
				currentState.draw(game, dt, ctx);
			}
			// If the game is loading, display the image for the loading.
			if(!game.finishLoading){
				var body = document.querySelector('body');
				body.style.backgroundImage = 'url("images/Raystorm_Loading.jpg")';
				body.style.backgroundRepeat = 'no-repeat';
				body.style.backgroundSize = 'cover';
			}
			if(!game.starfieldStart && game.finishLoading){
				game.starfieldStart =true;//Start starfield
				//Create the starfield.
				game.container = document.getElementById('starfield');
				game.containerfps = document.getElementById('fps');
				game.starfield = new Starfield();
				game.starfield.initialise(game.container, game.containerfps);
				game.starfield.start();

			}
		}
		this.intervalId = requestAnimationFrame(animationLoop);
	};
	this.intervalId = requestAnimationFrame(animationLoop);

};



//Mutes or unmutes the game.
Game.prototype.mute = function(mute) {

	//  If we've been told to mute, mute.
	if(mute === true) {
		//this.sounds.mute = true;
		for(var idPlayer=1;idPlayer<=12; idPlayer++){
			var player = document.querySelector('#audioPlayer' + idPlayer);
			player.volume = 1;
		}
		for(var idPlayer=1;idPlayer<=6; idPlayer++){
			var player = document.querySelector('#Sounds' + idPlayer);
			player.volume = 1;
		}
		this.isMute = false;

	} else if (mute === false) {
		//this.sounds.mute = false;
		for(idPlayer=1;idPlayer<=12; idPlayer++){
			var player = document.querySelector('#audioPlayer' + idPlayer);
			player.volume = 0;
		}
		for(var idPlayer=1;idPlayer<=6; idPlayer++){
			var player = document.querySelector('#Sounds' + idPlayer);
			player.volume = 0;
		}
		this.isMute = true;
	} else {
		// Toggle mute instead...
		//this.sounds.mute = this.sounds.mute ? false : true;
	}
};



Game.prototype.pushState = function(state) {

	//  If there's an enter function for the new state, call it.
	if(state.enter) {
		state.enter(game);
	}
	//  Set the current state.
	this.stateStack.push(state);
};

Game.prototype.popState = function() {

	//  Leave and pop the state.
	if(this.currentState()) {
		if(this.currentState().leave) {
			this.currentState().leave(game);
		}

		//  Set the current state.
		this.stateStack.pop();
	}
};

//The stop function stops the game.
Game.prototype.stop = function Stop() {
	clearInterval(this.intervalId);
};

//Inform the game a key is down.
Game.prototype.keyDown = function(keyCode) {
	this.pressedKeys[keyCode] = true;
	//  Delegate to the current state too.
	if(this.currentState() && this.currentState().keyDown) {
		this.currentState().keyDown(this, keyCode);
	}
};

//Inform the game a key is up.
Game.prototype.keyUp = function(keyCode) {
	delete this.pressedKeys[keyCode];
	//  Delegate to the current state too.
	if(this.currentState() && this.currentState().keyUp) {
		this.currentState().keyUp(this, keyCode);
	}
};

//Creates an instance of the LoadingGameChatState class. The loading is important to have the time to load all the musics.
function LoadingGameChatState() {

}

LoadingGameChatState.prototype.enter = function(game) {
//	// Create and load the sounds.
//	game.sounds = new Sounds();
//	game.sounds.init();
//	game.sounds.loadSound('shoot', 'sounds/shoot.wav');
//	game.sounds.loadSound('bang', 'sounds/bang.wav');
//	game.sounds.loadSound('explosion', 'sounds/explosion.wav');
//	game.sounds.loadSound('Game_Over', 'sounds/Game_Over.mp3');
//	game.sounds.loadSound('bonus_attack', 'sounds/bonus_attack.m4a');
//	game.sounds.loadSound('Aquarium', 'sounds/Aquarium.mp3');
//	game.sounds.loadSound('Catharsis', 'sounds/Catharsis.mp3');
//	game.sounds.loadSound('Cycloid', 'sounds/Cycloid.mp3');
//	game.sounds.loadSound('DeadAir', 'sounds/DeadAir.mp3');
//	game.sounds.loadSound('GeometricCity', 'sounds/GeometricCity.mp3');
//	game.sounds.loadSound('Intolerance', 'sounds/Intolerance.mp3');
//	game.sounds.loadSound('Luminescence', 'sounds/Luminescence.mp3');
//	game.sounds.loadSound('Metaphar', 'sounds/Metaphar.mp3');
//	game.sounds.loadSound('MuddlingThrough', 'sounds/MuddlingThrough.mp3');
//	game.sounds.loadSound('Ooparts', 'sounds/Ooparts.mp3');
//	game.sounds.loadSound('SlaughterHour', 'sounds/SlaughterHour.mp3');
//	game.sounds.loadSound('Toxoplasma', 'sounds/Toxoplasma.mp3');
};

LoadingGameChatState.prototype.update = function (game, dt) {

	// gamepad
	updateGamePadStatus();
	// After 5 seconds, move to welcome page.
	setTimeout(function(){game.moveToState(new LoadingGameSoundsState());}, 2000); // We must wait a few second to have the time to load all the sounds.

};


LoadingGameChatState.prototype.draw = function(game, dt, ctx) {

	//  Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	ctx.font="30px Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline="center"; 
	ctx.textAlign="center";
//	battleshipImg = new Image();
//	battleshipImg.src = 'images/titleRaystorm.png';
//	ctx.drawImage(battleshipImg, game.width / 2-300, game.height/2 - 210, 600, 200);
	ctx.fillText("Loading...", game.width / 2, game.height/2 - 40);
	ctx.font="16px Arial";

	ctx.fillText("Loading Chat. Please wait during a few seconds.", game.width / 2, game.height/2); 
//	battleshipImg = new Image();
//	battleshipImg.src = getLinkShip(game.numberShip);
//	ctx.drawImage(battleshipImg, game.width / 2, game.height/2 + 30,60, 60);
};


//Creates an instance of the LoadingGameChatState class. The loading is important to have the time to load all the musics.
function LoadingGameSoundsState() {

}
var maxprogress = 100;   // total à atteindre
var actualprogress = 0;  // valeur courante

LoadingGameSoundsState.prototype.enter = function(game) {
	var audio = document.getElementById('audio');
	audio.innerHTML = '<audio id="audioPlayer1"> <source src="sounds/Aquarium.mp3"> </audio> <audio id="audioPlayer2"> <source src="sounds/Catharsis.mp3"> </audio> <audio id="audioPlayer3"><source src="sounds/Cycloid.mp3"> </audio> <audio id="audioPlayer4"> <source src="sounds/DeadAir.mp3"> </audio> <audio id="audioPlayer5"> <source src="sounds/GeometricCity.mp3"> </audio> <audio id="audioPlayer6"> <source src="sounds/Intolerance.mp3"> </audio> <audio id="audioPlayer7"> <source src="sounds/Luminescence.mp3"> </audio> <audio id="audioPlayer8"> <source src="sounds/Metaphar.mp3"> </audio> <audio id="audioPlayer9"> <source src="sounds/MuddlingThrough.mp3"> </audio> <audio id="audioPlayer10"> <source src="sounds/Ooparts.mp3"> </audio> <audio id="audioPlayer11"> 	<source src="sounds/SlaughterHour.mp3"> </audio> <audio id="audioPlayer12"> <source src="sounds/Toxoplasma.mp3"> </audio> <audio id="Sounds1"><source src="sounds/bang.wav"></audio> <audio id="Sounds2"><source src="sounds/bonus_attack.m4a"></audio> <audio id="Sounds3"><source src="sounds/explosion.wav"></audio> <audio id="Sounds4"><source src="sounds/Game_Over.mp3"></audio> <audio id="Sounds5"><source src="sounds/invaderkilled.wav"></audio> <audio id="Sounds6"><source src="sounds/shoot.wav"></audio>';

//	// Create and load the sounds.
//	game.sounds = new Sounds();
//	game.sounds.init();
//	game.sounds.loadSound('shoot', 'sounds/shoot.wav');
//	game.sounds.loadSound('bang', 'sounds/bang.wav');
//	game.sounds.loadSound('explosion', 'sounds/explosion.wav');
//	game.sounds.loadSound('Game_Over', 'sounds/Game_Over.mp3');
//	game.sounds.loadSound('bonus_attack', 'sounds/bonus_attack.m4a');
//	game.sounds.loadSound('Aquarium', 'sounds/Aquarium.mp3');
//	game.sounds.loadSound('Catharsis', 'sounds/Catharsis.mp3');
//	game.sounds.loadSound('Cycloid', 'sounds/Cycloid.mp3');
//	game.sounds.loadSound('DeadAir', 'sounds/DeadAir.mp3');
//	game.sounds.loadSound('GeometricCity', 'sounds/GeometricCity.mp3');
//	game.sounds.loadSound('Intolerance', 'sounds/Intolerance.mp3');
//	game.sounds.loadSound('Luminescence', 'sounds/Luminescence.mp3');
//	game.sounds.loadSound('Metaphar', 'sounds/Metaphar.mp3');
//	game.sounds.loadSound('MuddlingThrough', 'sounds/MuddlingThrough.mp3');
//	game.sounds.loadSound('Ooparts', 'sounds/Ooparts.mp3');
//	game.sounds.loadSound('SlaughterHour', 'sounds/SlaughterHour.mp3');
//	game.sounds.loadSound('Toxoplasma', 'sounds/Toxoplasma.mp3');


	var progress = document.getElementById('progress');
	progress.innerHTML = '<progress value="0" max="100" class="progress-bar blue"></progress>';
	var progressnum = document.getElementById('progressnum');
	progressnum.innerHTML = '0%';
	
	// After 5 seconds, move to welcome page.
	setTimeout(function(){
		var progress = document.getElementById('progress');
		progress.innerHTML = '';
		var progressnum = document.getElementById('progressnum');
		progressnum.innerHTML = '';
		game.moveToState(new WelcomeState());}, 7000); // We must wait a few second to have the time to load all the sounds.

}	  



LoadingGameSoundsState.prototype.update = function (game, dt) {

	// gamepad
	updateGamePadStatus();

	var progressnum = document.getElementById("progressnum");
	var progress = document.querySelector("progress");
	if(actualprogress != maxprogress){
		actualprogress += 1;
	}
	progress.setAttribute('value', actualprogress);
	progressnum.innerHTML = actualprogress +"%";



//	// After 5 seconds, move to welcome page.
//	setTimeout(function(){
//		var progress = document.getElementById('progress');
//		progress.innerHTML = '';
//		var progressnum = document.getElementById('progressnum');
//		progressnum.innerHTML = '';
//		game.moveToState(new WelcomeState());}, 7000); // We must wait a few second to have the time to load all the sounds.

};


LoadingGameSoundsState.prototype.draw = function(game, dt, ctx) {

	//  Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	ctx.font="30px Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline="center"; 
	ctx.textAlign="center";
//	battleshipImg = new Image();
//	battleshipImg.src = 'images/titleRaystorm.png';
//	ctx.drawImage(battleshipImg, game.width / 2-300, game.height/2 - 210, 600, 200);
	ctx.fillText("Loading...", game.width / 2, game.height/2 - 40);
	ctx.font="16px Arial";

	ctx.fillText("Loading sounds and musics. Please wait during a few seconds.", game.width / 2, game.height/2); 
//	battleshipImg = new Image();
//	battleshipImg.src = getLinkShip(game.numberShip);
//	ctx.drawImage(battleshipImg, game.width / 2, game.height/2 + 30,60, 60);
};


//Creates an instance of the WelcomeState class.
function WelcomeState() {

}

/******CLASS METHODS FOR WELCOMESTATE CLASS******/

WelcomeState.prototype.enter = function(game) {

	game.player = document.querySelector('#audioPlayer10');
	game.player.play();
	game.finishLoading = true;

};

WelcomeState.prototype.update = function (game, dt) {
	//play music
//	if(!game.playmusic){
//	game.playmusic = true;
//	game.sounds.playSound('Aquarium');
//	//setTimeout(function(){game.sounds.playSound('Aquarium');}, 5000); //We must wait a few second to have the time to load all the sounds.
//	//console.log("test");
//	}


	// gamepad
	updateGamePadStatus();

	if(game.PressKeyToContinue) /*Start*/ {
		//  Start button starts the game.
		game.level = 1;
		game.score = 0;
		game.lives = 3;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
//		game.sounds.StopSound();
//		game.playmusic = false;
//		//console.log("stop");

		game.moveToState(new LevelIntroState(game.level));
		game.PressKeyToContinue = false;
	}

};

WelcomeState.prototype.draw = function(game, dt, ctx) {

	//  Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	ctx.font="30px Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline="center"; 
	ctx.textAlign="center";
	battleshipImg = new Image();
	battleshipImg.src = 'images/titleRaystorm.png';
	ctx.drawImage(battleshipImg, game.width / 2-300, game.height/2 - 210, 600, 200);
	//ctx.fillText("RayStorm", game.width / 2, game.height/2 - 40);
	ctx.font="16px Arial";

	ctx.fillText("Press 'Space' or 'Start' button to begin the game.", game.width / 2, game.height/2); 
	battleshipImg = new Image();
	battleshipImg.src = getLinkShip(game.numberShip);
	ctx.drawImage(battleshipImg, game.width / 2, game.height/2 + 30,60, 60);
};

WelcomeState.prototype.keyDown = function(game, keyCode) {

	if(keyCode == 32) /*space*/ {
		//  Space starts the game.
		game.level = 1;
		game.score = 0;
		game.lives = 3;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
//		game.sounds.StopSound();
//		game.playmusic = false;
//		//console.log("stop");

		game.moveToState(new LevelIntroState(game.level));
	}
	
	if(keyCode===65){
		if(game.numberShip > game.numberMaxShip){
			game.numberShip = game.numberMaxShip;
		}
		else{
			game.numberShip++;
		}
	}
	if(keyCode===90){
		if(game.numberShip < 0){
			game.numberShip = 0;
		}
		else{
			game.numberShip--;
		}
	}
};

/*  
Level Intro State class

The Level Intro state shows a 'Level X' message and
a countdown for the level.
 */
function LevelIntroState(level) {
	this.level = level;
	this.countdownMessage = "3";
}

/******CLASS METHODS FOR LEVELINTROSTATE CLASS******/

LevelIntroState.prototype.update = function(game, dt) {

//	Update the countdown.
	if(this.countdown === undefined) {
		this.countdown = 3; // countdown from 3 secs
	}
	this.countdown -= dt;

	if(this.countdown < 2) { 
		this.countdownMessage = "2"; 
	}
	if(this.countdown < 1) { 
		this.countdownMessage = "1"; 
	} 
	if(this.countdown <= 0) {
		//  Move to the next level, popping this state.
		game.moveToState(new PlayState(game.config, this.level));
	}

};

LevelIntroState.prototype.draw = function(game, dt, ctx) {

//	Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	ctx.font="36px Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline="middle"; 
	ctx.textAlign="center"; 
	ctx.fillText("Level " + this.level, game.width / 2, game.height/2);
	ctx.font="24px Arial";
	ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);      
	return;
};



//Create a PlayState with the game config and the level you are on.
//Creates an instance of the PlayState class.
function PlayState(config, level) {
	this.config = config;
	this.level = level;

	//  Game state.
	this.invaderCurrentVelocity =  10;
	this.invaderCurrentDropDistance =  0;
	this.invadersAreDropping =  false;
	this.lastRocketTime = null;

	//  Game entities.
	this.ship = null;
	this.invaders = [];
	this.rockets = [];
	this.bombs = [];
	this.lightSabers = [];
	this.powerItems = [];
	this.shipShieldItems = [];
}

/******CLASS METHODS FOR PLAYSTATE CLASS******/

PlayState.prototype.enter = function(game) {

	//  Create the ship.
	this.ship = new Ship(game.width / 2, game.gameBounds.bottom);

	//  Setup initial state.
	this.invaderCurrentVelocity =  10;
	this.invaderCurrentDropDistance =  0;
	this.invadersAreDropping =  false;

	//  Set the ship speed for this level, as well as invader params.
	var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
	this.shipSpeed = this.config.shipSpeed;
	this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity);
	this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
	this.lightSaberRate = this.config.lightSaberRate + (levelMultiplier * this.config.lightSaberRate);
	this.powerItemRate = this.config.powerItemRate;
	this.shipShieldItemRate = this.config.shipShieldItemRate;
	this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
	this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);
	this.lightSaberMinVelocity = this.config.lightSaberMinVelocity + (levelMultiplier * this.config.lightSaberMinVelocity);
	this.lightSaberMaxVelocity = this.config.lightSaberMaxVelocity + (levelMultiplier * this.config.lightSaberMaxVelocity);

	//  Create the invaders.
	var ranks = this.config.invaderRanks;
	var files = this.config.invaderFiles;
	var invaders = [];
	for(var rank = 0; rank < ranks; rank++){
		for(var file = 0; file < files; file++) {
			invaders.push(new Invader(
					(game.width / 2) + ((files/2 - file) * 200 / files),
					(game.gameBounds.top + rank * 20),
					rank, file, 'Invader'));
		}
	}
	this.invaders = invaders;
	this.invaderCurrentVelocity = this.invaderInitialVelocity;
	this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
	this.invaderNextVelocity = null;
};

PlayState.prototype.update = function(game, dt) {

	//play music
	if(!game.playmusic){
		//var nbMusic = parseInt(getRandomArbitrary(1, 13));
		var music = chooseLevelMusic(game)
		// Play music
		game.player = document.querySelector(music);
		game.player.play();
		game.playmusic = true;
	}

	// gamepad
	updateGamePadStatus();
	//  If the left or right arrow keys are pressed, move
	//  the ship. Check this on ticks rather than via a keydown
	//  event for smooth movement, otherwise the ship would move
	//  more like a text editor caret.
	if(game.pressedKeys[37] || game.inputStates.left) {
		this.ship.x -= this.shipSpeed * dt;
	}
	if(game.pressedKeys[39] || game.inputStates.right) {
		this.ship.x += this.shipSpeed * dt;
	}
	if(game.pressedKeys[38] || game.inputStates.up) {
		this.ship.y -= this.shipSpeed * dt;
	}
	if(game.pressedKeys[40] || game.inputStates.down) {
		this.ship.y += this.shipSpeed * dt;
	}
	if(game.pressedKeys[32] || game.isFireRocket) {
		this.fireRocket();
		game.isFireRocket = false;
	}
	if(game.isPause){
		// Stop the music.
		game.player.pause(); // Put the music in pause.
		//game.player.currentTime = 0; // Put the music at the beginning. 

		game.isPause = false;
		//Push the pause state.
		game.pushState(new PauseState());

	}

	//  Keep the ship in bounds.
	if(this.ship.x < game.gameBounds.left) {
		this.ship.x = game.gameBounds.left;
	}
	if(this.ship.x > game.gameBounds.right) {
		this.ship.x = game.gameBounds.right;
	}
	if(this.ship.y < game.gameBounds.top) {
		this.ship.y = game.gameBounds.top;
	}
	if(this.ship.y > game.gameBounds.bottom) {
		this.ship.y = game.gameBounds.bottom;
	}

	//  Move each bomb.
	for(var i=0; i<this.bombs.length; i++) {
		var bomb = this.bombs[i];
		bomb.y += dt * bomb.velocity;
		if(this.level>=3){
		bomb.x += bomb.angle * dt * bomb.velocity;	
		}

		//  If the rocket has gone off the screen remove it.
		if(bomb.y > this.height) {
			this.bombs.splice(i--, 1);
		}
	}
	
//  Move each lightSaber.
	for(var i=0; i<this.lightSabers.length; i++) {
		var lightSaber = this.lightSabers[i];
		
//		// Increment the angle of rotation.
//		lightSaber.theta += 1;
//		this.lightSabers[i].theta = lightSaber.theta;
//		
//		// Rotation.
//		lightSaber.x = Math.cos(lightSaber.theta)*(lightSaber.x - lightSaber.x3) - Math.sin(lightSaber.theta)*(lightSaber.y - lightSaber.y3) + lightSaber.x3;
//		lightSaber.y = Math.sin(lightSaber.theta) * (lightSaber.x - lightSaber.x3) + Math.sin(lightSaber.theta) * (lightSaber.y - lightSaber.y3) + lightSaber.y3;
//		lightSaber.x2 = Math.cos(lightSaber.theta)*(lightSaber.x2 - lightSaber.x3) - Math.sin(lightSaber.theta)*(lightSaber.y2 - lightSaber.y3) + lightSaber.x3;
//		lightSaber.y2 = Math.sin(lightSaber.theta) * (lightSaber.x2 - lightSaber.x3) + Math.sin(lightSaber.theta) * (lightSaber.y2 - lightSaber.y3) + lightSaber.y3;
//		lightSaber.x3 = Math.cos(lightSaber.theta)*(lightSaber.x3 - lightSaber.x3) - Math.sin(lightSaber.theta)*(lightSaber.y3 - lightSaber.y3) + lightSaber.x3;
//		lightSaber.y3 = Math.sin(lightSaber.theta) * (lightSaber.x3 - lightSaber.x3) + Math.sin(lightSaber.theta) * (lightSaber.y3 - lightSaber.y3) + lightSaber.y3;
//		
		// Translation.
		lightSaber.y  += dt * lightSaber.velocity;
		lightSaber.y2 += dt * lightSaber.velocity;
		lightSaber.y3 += dt * lightSaber.velocity;
		if(this.level>=3){ 
			lightSaber.x += lightSaber.angle * dt * lightSaber.velocity;
			lightSaber.x2 += lightSaber.angle * dt * lightSaber.velocity;
			lightSaber.x3 += lightSaber.angle * dt * lightSaber.velocity;
		}

		//  If the rocket has gone off the screen remove it.
		if(lightSaber.y > this.height) {
			this.lightSabers.splice(i--, 1);
		}
	}

	//  Move each powerItems.
	for(var i=0; i<this.powerItems.length; i++) {
		var powerItem = this.powerItems[i];
		powerItem.y += dt * powerItem.velocity;

		//  If the powerItem has gone off the screen remove it.
		if(powerItem.y > this.height) {
			this.powerItems.splice(i--, 1);
		}
	}

//	Move each shipShieldItems.
	for(var i=0; i<this.shipShieldItems.length; i++) {
		var shipShieldItem = this.shipShieldItems[i];
		shipShieldItem.y += dt * shipShieldItem.velocity;

		//  If the powerItem has gone off the screen remove it.
		if(shipShieldItem.y > this.height) {
			this.shipShieldItems.splice(i--, 1);
		}
	}

	//  Move each rocket.
	for(i=0; i<this.rockets.length; i++) {
		var rocket = this.rockets[i];
		rocket.y -= dt * rocket.velocity;

		//  If the rocket has gone off the screen remove it.
		if(rocket.y < 0) {
			this.rockets.splice(i--, 1);
		}
	}

	//  Move the invaders.
	var hitLeft = false, hitRight = false, hitBottom = false;
	for(i=0; i<this.invaders.length; i++) {
		var invader = this.invaders[i];
		var newx = invader.x + this.invaderVelocity.x * dt;
		var newy = invader.y + this.invaderVelocity.y * dt;
		if(hitLeft == false && newx < game.gameBounds.left) {
			hitLeft = true;
		}
		else if(hitRight == false && newx > game.gameBounds.right) {
			hitRight = true;
		}
		else if(hitBottom == false && newy > game.gameBounds.bottom) {
			hitBottom = true;
		}

		if(!hitLeft && !hitRight && !hitBottom) {
			invader.x = newx;
			invader.y = newy;
		}
	}

	//  Update invader velocities.
	if(this.invadersAreDropping) {
		this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
		if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
			this.invadersAreDropping = false;
			this.invaderVelocity = this.invaderNextVelocity;
			this.invaderCurrentDropDistance = 0;
		}
	}
	//  If we've hit the left, move down then right.
	if(hitLeft) {
		this.invaderCurrentVelocity += this.config.invaderAcceleration;
		this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
		this.invadersAreDropping = true;
		this.invaderNextVelocity = {x: this.invaderCurrentVelocity , y:0};
	}
	//  If we've hit the right, move down then left.
	if(hitRight) {
		this.invaderCurrentVelocity += this.config.invaderAcceleration;
		this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
		this.invadersAreDropping = true;
		this.invaderNextVelocity = {x: -this.invaderCurrentVelocity , y:0};
	}
	//  If we've hit the bottom, it's game over.
	if(hitBottom) {
		this.lives = 0;
	}

	//  Check for rocket/invader collisions.
	for(i=0; i<this.invaders.length; i++) {
		var invader = this.invaders[i];
		var bang = false;

		for(var j=0; j<this.rockets.length; j++){
			var rocket = this.rockets[j];

			if(rocket.x >= (invader.x - invader.width/2) && rocket.x <= (invader.x + invader.width/2) &&
					rocket.y >= (invader.y - invader.height/2) && rocket.y <= (invader.y + invader.height/2)) {

				//  Remove the rocket, set 'bang' so we don't process
				//  this rocket again.
				this.rockets.splice(j--, 1);
				bang = true;
				game.score += this.config.pointsPerInvader;
				break;
			}
		}
		if(bang) {
			this.invaders.splice(i--, 1);
			//game.sounds.playSound('bang');
		}
	}

	//  Find all of the front rank invaders.
	var frontRankInvaders = {};
	for(var i=0; i<this.invaders.length; i++) {
		var invader = this.invaders[i];
		//  If we have no invader for game file, or the invader
		//  for game file is futher behind, set the front
		//  rank invader to game one.
		if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
			frontRankInvaders[invader.file] = invader;
		}
	}

	//  Give each front rank invader a chance to drop a bomb.
	for(var i=0; i<this.config.invaderFiles; i++) {
		var invader = frontRankInvaders[i];
		if(!invader) continue;
		var chance = this.bombRate * dt;
		if(chance > Math.random()) {
			//  Fire!
			this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2, 
					this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity), getRandomIntInclusive(-1,1)));
		}
	}
	
	//  Give each front rank invader a chance to drop a bomb.
	for(var i=0; i<this.config.invaderFiles; i++) {
		var invader = frontRankInvaders[i];
		if(!invader) continue;
		var chance = this.lightSaberRate * dt;
		if(chance > Math.random()) {
			//  Fire!
			this.lightSabers.push(new LightSaber(invader.x, invader.y + invader.height / 2,
					this.lightSaberMinVelocity + Math.random()*(this.lightSaberMaxVelocity - this.lightSaberMinVelocity), getRandomIntInclusive(-1,1)));
		}
	}

	//  Give each front rank invader a chance to drop a powerItem.
	for(var i=0; i<this.config.invaderFiles; i++) {
		var invader = frontRankInvaders[i];
		if(!invader) continue;
		var chance = this.powerItemRate * dt;
		if(chance > Math.random()) {
			//  Fire!
			this.powerItems.push(new PowerItem(invader.x, invader.y + invader.height / 2, 
					this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
		}
	}

//	Give each front rank invader a chance to drop a shipShieldItems.
	for(var i=0; i<this.config.invaderFiles; i++) {
		var invader = frontRankInvaders[i];
		if(!invader) continue;
		var chance = this.shipShieldItemRate * dt;
		if(chance > Math.random()) {
			//  Fire!
			this.shipShieldItems.push(new ShieldItem(invader.x, invader.y + invader.height / 2, 
					this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
		}
	}

	//  Check for bomb/ship collisions.
	for(var i=0; i<this.bombs.length; i++) {
		var bomb = this.bombs[i];
		if(game.hasShield){
			if(bomb.x >= (this.ship.x - this.ship.width/2)-20 && bomb.x <= (this.ship.x + this.ship.width/2) +20 &&
					bomb.y >= (this.ship.y - this.ship.height/2) -30 && bomb.y <= (this.ship.y + this.ship.height/2) +30) {
				this.bombs.splice(i--, 1);
			}
		}
		else if(bomb.x >= (this.ship.x - this.ship.width/2) && bomb.x <= (this.ship.x + this.ship.width/2) &&
				bomb.y >= (this.ship.y - this.ship.height/2) && bomb.y <= (this.ship.y + this.ship.height/2)) {
			this.bombs.splice(i--, 1);
			// If the ship doesn't have any shield, decrease the life.
			if(!game.hasShield){
				game.lives--;
			}
			//game.sounds.playSound('explosion');
		}

	}
	
//  Check for lightSaber/ship collisions.
	for(var i=0; i<this.lightSabers.length; i++) {
		var lightSaber = this.lightSabers[i];
		if(game.hasShield){
			if(lightSaber.x2 >= (this.ship.x - this.ship.width/2)-20 && lightSaber.x2 <= (this.ship.x + this.ship.width/2) +20 &&
					lightSaber.y2 >= (this.ship.y - this.ship.height/2) -30 && lightSaber.y2 <= (this.ship.y + this.ship.height/2) +30) {
				this.lightSabers.splice(i--, 1);
			}
		}
		else if((lightSaber.x >= (this.ship.x - this.ship.width/2) && lightSaber.x <= (this.ship.x + this.ship.width/2) &&
				lightSaber.y >= (this.ship.y - this.ship.height/2) && lightSaber.y <= (this.ship.y + this.ship.height/2)) || (lightSaber.x1 >= (this.ship.x - this.ship.width/2) && lightSaber.x1 <= (this.ship.x + this.ship.width/2) &&
						lightSaber.y1 >= (this.ship.y - this.ship.height/2) && lightSaber.y1 <= (this.ship.y + this.ship.height/2)) || ((lightSaber.x3 >= (this.ship.x - this.ship.width/2) && lightSaber.x3 <= (this.ship.x + this.ship.width/2) &&
								lightSaber.y3 >= (this.ship.y - this.ship.height/2) && lightSaber.y3 <= (this.ship.y + this.ship.height/2)))) {
			this.lightSabers.splice(i--, 1);
			// If the ship doesn't have any shield, decrease the life.
			if(!game.hasShield){
				game.lives--;
				game.config.rocketMaxFireRate = 0; // Decrease the fire rate during 8 secondes.
				setTimeout(function () {game.config.rocketMaxFireRate=2;}, 8000); // After 8 seconds, set rocketMaxFireRate =2. 
			}
			//game.sounds.playSound('explosion');
		}

	}
	

//	Check for powerItem/ship collisions.
	for(var i=0; i<this.powerItems.length; i++) {
		var powerItem = this.powerItems[i];
		if(powerItem.x >= (this.ship.x - this.ship.width/2) && powerItem.x <= (this.ship.x + this.ship.width/2) &&
				powerItem.y >= (this.ship.y - this.ship.height/2) && powerItem.y <= (this.ship.y + this.ship.height/2)) {
			this.powerItems.splice(i--, 1);
			//get some powers
			game.config.rocketMaxFireRate=5;
			setTimeout(function () {game.config.rocketMaxFireRate=2;}, 8000); // After 8 seconds, set rocketMaxFireRate =2. 
			//game.lives++;
			//game.sounds.playSound('bonus_attack');
		}

	}

//	Check for shipShieldItem/ship collisions.
	for(var i=0; i<this.shipShieldItems.length; i++) {
		var shipShieldItem = this.shipShieldItems[i];
		if(shipShieldItem.x >= (this.ship.x - this.ship.width/2) && shipShieldItem.x <= (this.ship.x + this.ship.width/2) &&
				shipShieldItem.y >= (this.ship.y - this.ship.height/2) && shipShieldItem.y <= (this.ship.y + this.ship.height/2)) {
			this.shipShieldItems.splice(i--, 1);
			//get some powers
			game.hasShield = true;
			setTimeout(function () {game.hasShield = false; game.shieldRed = false;}, 8000); // After 8 seconds, set hasShield to false (the ship doesn't have shield any more). 
			setTimeout(function () {game.shieldRed = true;}, 6000); // After 8 seconds, set hasShield to false (the ship doesn't have shield any more). 

			//game.lives++;
			//game.sounds.playSound('bonus_attack');
		}

	}

	//  Check for invader/ship collisions.
	for(var i=0; i<this.invaders.length; i++) {
		var invader = this.invaders[i];
		if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) && 
				(invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
				(invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
				(invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) {
			//  Dead by collision!
			game.lives = 0;
			//game.sounds.playSound('explosion');
		}
	}

	//  Check for failure
	if(game.lives <= 0) {
		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
		game.playmusic = false;
		game.moveToState(new GameOverState());
	}

	//  Check for victory
	if(this.invaders.length === 0) {
		game.score += this.level * 50;
		game.level += 1;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
		game.playmusic = false;
		game.moveToState(new LevelIntroState(game.level));
	}

};

PlayState.prototype.draw = function(game, dt, ctx) {

	//  Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	//  Draw ship.
	battleshipImg = new Image();
	battleshipImg.src = getLinkShip(game.numberShip);
	ctx.drawImage(battleshipImg, this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);

	if(game.hasShield && (!game.shieldRed)){
		shield = new Image();
		shield.src = 'images/MagicShield.png';
		ctx.drawImage(shield, this.ship.x - (this.ship.width /2 ) -95, this.ship.y - (this.ship.height / 2)-30, this.ship.width+200, this.ship.height+100);
	}
	else if (game.hasShield && game.shieldRed){
		shield = new Image();
		shield.src = 'images/Magic_Shield_Red.png';
		ctx.drawImage(shield, this.ship.x - (this.ship.width /2 ) -98, this.ship.y - (this.ship.height / 2)-75, this.ship.width+200, this.ship.height+100);

	}

	//  Draw invaders.
	for(var i=0; i<this.invaders.length; i++) {
		var invader = this.invaders[i];
		invaderImg = new Image();
		invaderImg.src = 'images/spaceInvaderAliens1.png';
		ctx.drawImage(invaderImg, invader.x - invader.width/2, invader.y - invader.height/2, invader.width, invader.height);
	}

	//  Draw bombs.
	for(var i=0; i<this.bombs.length; i++) {
		var bomb = this.bombs[i];
		invaderImg = new Image();
		invaderImg.src = 'images/bouleDeFeuAnime.gif';
		ctx.drawImage(invaderImg, bomb.x - 2, bomb.y - 2, 10, 15);
	}
	
//  Draw lightSabers.
	ctx.fillStyle = '#ff0000';
	for(var i=0; i<this.lightSabers.length; i++) {
		var lightSaber = this.lightSabers[i];
		invaderImg = new Image();
		invaderImg.src = 'images/fireBlue.gif';
		ctx.drawImage(invaderImg, lightSaber.x - 2, lightSaber.y - 2, 15, 30);
//		ctx.fillRect(lightSaber.x, lightSaber.y - 2, 1, 20);
	}

	//  Draw rockets.
	ctx.fillStyle = '#ff0000';
	for(var i=0; i<this.rockets.length; i++) {
		var rocket = this.rockets[i];
		ctx.fillRect(rocket.x, rocket.y - 2, 1, 4);
	}

	//  Draw item super powers.
	for(var i=0; i<this.powerItems.length; i++) {
		var powerItem = this.powerItems[i];
		invaderImg = new Image();
		invaderImg.src = 'images/etoileAnime9.gif';
		ctx.drawImage(invaderImg, powerItem.x - 2, powerItem.y - 2, 25, 20);
	}

	//  Draw item super powers shield.
	for(var i=0; i<this.shipShieldItems.length; i++) {
		var shipShieldItem = this.shipShieldItems[i];
		invaderImg = new Image();
		invaderImg.src = 'images/etoileAnime10.png';
		ctx.drawImage(invaderImg, shipShieldItem.x - 2, shipShieldItem.y - 2, 25, 20);
	}


	//  Draw info.
	var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
	ctx.font="14px Arial";
	ctx.fillStyle = '#ffffff';
	var info = "Lives: " + game.lives;
	ctx.textAlign = "left";
	ctx.fillText(info, game.gameBounds.left, textYpos);
	info = "Score: " + game.score + ", Level: " + game.level;
	ctx.textAlign = "right";
	ctx.fillText(info, game.gameBounds.right, textYpos);

	//  If we're in debug mode, draw bounds.
	if(this.config.debugMode) {
		ctx.strokeStyle = '#ff0000';
		ctx.strokeRect(0,0,game.width, game.height);
		ctx.strokeRect(game.gameBounds.left, game.gameBounds.top,
				game.gameBounds.right - game.gameBounds.left,
				game.gameBounds.bottom - game.gameBounds.top);
	}

};

PlayState.prototype.keyDown = function(game, keyCode) {

	//If user push the space touch
	if(keyCode == 32) {
		//Fire
		this.fireRocket();
	}
	//If user push the p touch
	if(keyCode == 80) {
		// Stop the music.
		game.player.pause(); // Put the music in pause.
		//game.player.currentTime = 0; // Put the music at the beginning. 

		//Push the pause state.
		game.pushState(new PauseState());
	}
	
	if(keyCode===65){
		if(game.numberShip > game.numberMaxShip){
			game.numberShip = game.numberMaxShip;
		}
		else{
			game.numberShip++;
		}
	}
	if(keyCode===90){
		if(game.numberShip < 0){
			game.numberShip = 0;
		}
		else{
			game.numberShip--;
		}
	}
};

PlayState.prototype.keyUp = function(game, keyCode) {

};

PlayState.prototype.fireRocket = function() {
	//  If we have no last rocket time, or the last rocket time 
	//  is older than the max rocket rate, we can fire.
	if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate))
	{   
		//  Add a rocket.
		this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
		this.lastRocketTime = (new Date()).valueOf();

		//  Play the 'shoot' sound.
		//game.sounds.playSound('shoot');
	}
};

function PauseState() {

}

PauseState.prototype.enter = function(game) {
	game.player = document.querySelector('#audioPlayer2');
	game.player.play();

};

PauseState.prototype.keyDown = function(game, keyCode) {

	//If user push the p touch
	if(keyCode == 80) {
//		game.sounds.StopSound();// Stop the music of pause.
//		game.playMusiqueGameOver = false;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 

		game.playmusic = false; // Variable to play the music of the main game.
		//  Pop the pause state.
		game.popState();
	}
};

PauseState.prototype.update = function(game, dt) {

//	if(!game.playMusiqueGameOver){
//	game.sounds.playSound(chooseRandomMusic());
//	game.playMusiqueGameOver = true;
//	}
	// gamepad
	updateGamePadStatus();

	if(game.QuitPause) {
//		game.sounds.StopSound();//Stop the music of Game Over
//		game.playMusiqueGameOver = false;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
		game.playmusic = false; // Variable to play the music of the main game.
		//  Pop the pause state.
		game.popState();
		game.QuitPause = false;

	}

};

PauseState.prototype.draw = function(game, dt, ctx) {

	//  Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	ctx.font="14px Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline="middle";
	ctx.textAlign="center";
	ctx.fillText("Paused", game.width / 2, game.height/2);
	return;
};


//Creates an instance of the GameOverState class.
function GameOverState() {

}

GameOverState.prototype.enter = function(game) {
	game.player = document.querySelector('#Sounds4');
	game.player.play();
};

/******CLASS METHODS FOR GAMEOVERSTATE CLASS******/

GameOverState.prototype.update = function(game, dt) {

//	if(!game.playMusiqueGameOver){
//	game.sounds.playSound('Game_Over');
//	game.playMusiqueGameOver = true;
//	}
	game.PressKeyToContinue = false;
	// gamepad
	updateGamePadStatus();

	if(game.PressKeyToContinue) /*Start*/ {
		//  Start restarts the game.
		game.lives = 3;
		game.score = 0;
		game.level = 1;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
//		game.sounds.StopSound();//Stop the music of Game Over
//		game.playMusiqueGameOver = false;

		game.moveToState(new LevelIntroState(1));
	}
};

GameOverState.prototype.draw = function(game, dt, ctx) {

	//  Clear the background.
	ctx.clearRect(0, 0, game.width, game.height);

	ctx.font="30px Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline="center"; 
	ctx.textAlign="center"; 
	ctx.fillText("Game Over!", game.width / 2, game.height/2 - 40); 
	ctx.font="16px Arial";
	ctx.fillText("You scored " + game.score + " and got to level " + game.level, game.width / 2, game.height/2);
	ctx.font="16px Arial";
	ctx.fillText("Press 'Space' or 'Start' to play again.", game.width / 2, game.height/2 + 40);   
};

GameOverState.prototype.keyDown = function(game, keyCode) {

	if(keyCode == 32) /*space*/ {
		//  Space restarts the game.
		game.lives = 3;
		game.score = 0;
		game.level = 1;

		// Stop the music.
		game.player.pause(); // Put the music in pause.
		game.player.currentTime = 0; // Put the music at the beginning. 
//		game.sounds.StopSound();//Stop the music of Game Over
//		game.playMusiqueGameOver = false;

		game.moveToState(new LevelIntroState(1));
	}
};

/*

  Ship class

  The ship has a position and that's about it.

 */
function Ship(x, y) {
	this.x = x;
	this.y = y;
	this.width = 40;
	this.height = 36;
}

/*

LightSaber class

The LightSabers have a position, a width and a height.

*/
function LightSaber(x, y, velocity, angle) {
	this.x = x;
	this.y = y;
	this.x2 = x;
	this.y2 = y +20;
	this.x3 = x;
	this.y3 = y +10;
	this.theta = 0;
	this.velocity = velocity;
	this.angle = angle;
}

/*
    Rocket class

    Fired by the ship, they've got a position, velocity and state.

 */
function Rocket(x, y, velocity) {
	this.x = x;
	this.y = y;
	this.velocity = velocity;
}

/*
    Bomb class

    Dropped by invaders, they've got position, velocity.

 */
function Bomb(x, y, velocity, angle) {
	this.x = x;
	this.y = y;
	this.velocity = velocity;
	this.angle = angle;
}	

function getRandomIntInclusive(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min +1)) + min;
	}

/*
PowerItem class

Dropped by invaders, they've got position, velocity.

 */
function PowerItem(x, y, velocity) {
	this.x = x;
	this.y = y;
	this.velocity = velocity;
}

/*
ShieldItem class

Dropped by invaders, they've got position, velocity.

 */
function ShieldItem(x, y, velocity) {
	this.x = x;
	this.y = y;
	this.velocity = velocity;
}


/*
    Invader class

    Invader's have position, type, rank/file and that's about it. 
 */

function Invader(x, y, rank, file, type) {
	this.x = x;
	this.y = y;
	this.rank = rank;
	this.file = file;
	this.type = type;
	this.width = 28;
	this.height = 24;
}

/*
    Game State class

    A Game State is simply an update and draw proc.
    When a game is in the state, the update and draw procs are
    called, with a dt value (dt is delta time, i.e. the number)
    of seconds to update or draw).

 */
function GameState(updateProc, drawProc, keyDown, keyUp, enter, leave) {
	this.updateProc = updateProc;
	this.drawProc = drawProc;
	this.keyDown = keyDown;
	this.keyUp = keyUp;
	this.enter = enter;
	this.leave = leave;
}

/*

    Sounds class

    The sounds class is used to asynchronously load sounds and allow
    them to be played.

 */
//function Sounds() {

////The audio context.
//this.audioContext = null;

////The actual set of loaded sounds.
//this.sounds = {};
//}

///******CLASS METHODS FOR SOUNDS CLASS******/

//Sounds.prototype.init = function() {

////Create the audio context, paying attention to webkit browsers.
//context = window.AudioContext || window.webkitAudioContext;
//this.audioContext = new context();
//this.mute = false;
//};

//Sounds.prototype.loadSound = function(name, url) {

////Reference to ourselves for closures.
//var self = this;

////Create an entry in the sounds object.
//this.sounds[name] = null;

////Create an asynchronous request for the sound.
//var req = new XMLHttpRequest();
//req.open('GET', url, true);
//req.responseType = 'arraybuffer';
//req.onload = function() {
//self.audioContext.decodeAudioData(req.response, function(buffer) {
//self.sounds[name] = {buffer: buffer};
//});
//};
//try {
//req.send();
//} catch(e) {
//console.log("An exception occured getting sound the sound " + name + " this might be " +
//"because the page is running from the file system, not a webserver.");
//console.log(e);
//}
//};

//Sounds.prototype.playSound = function(name) {

////If we've not got the sound, don't bother playing it.
//if(this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
//if(this.sounds[name] === undefined){
//console.log("not sound: sounds[name] === undefined");
//}
//if(this.sounds[name] === null){
//console.log("not sound: sounds[name] === null");
//}
//if(this.mute === true){
//console.log("not sound: mute");
//}
////console.log("not sound");
//return;
//}

////Create a sound source, set the buffer, connect to the speakers and
////play the sound.
//this.sourceSound = this.audioContext.createBufferSource();
//this.sourceSound.buffer = this.sounds[name].buffer;
//this.sourceSound.connect(this.audioContext.destination);
//this.sourceSound.start(0);

//};

//Sounds.prototype.StopSound = function() {
//this.sourceSound.stop();
//};

//----------------------------------
//gamepad utility code
//----------------------------------
var gamepad;
window.addEventListener("gamepadconnected", function(e) {
	// now as a global var
	gamepad = e.gamepad;
	var index = gamepad.index;
	var id = gamepad.id;
	var nbButtons = gamepad.buttons.length;
	var nbAxes = gamepad.axes.length;
	console.log("Gamepad No " + index +
			", with id " + id + " is connected. It has " +
			nbButtons + " buttons and " +
			nbAxes + " axes");
});

window.addEventListener("gamepaddisconnected", function(e) {
	var gamepad = e.gamepad;
	var index = gamepad.index;
	console.log("Gamepad No " + index + " has been disconnected");
});

function updateGamePadStatus() {
	// get new snapshot of the gamepad properties
	scangamepads();
//	Check gamepad button states
	checkButtons(gamepad);
//	Check joysticks
	checkAxes(gamepad);
}

//detect axis (joystick states)
function checkAxes(gamepad) {
	if(gamepad === undefined) return;
	if(!gamepad.connected) return;

	// Set inputStates.left, right, up, down
	game.inputStates.left = game.inputStates.right = game.inputStates.up =   game.inputStates.down = false;

	// all values between [-1 and 1]
	// Horizontal detection
	if(gamepad.axes[0] > 0.5) {
		game.inputStates.right=true;
		game.inputStates.left=false;
		console.log("direction: right");
	} else if(gamepad.axes[0] < -0.5) {
		game.inputStates.left=true;
		game.inputStates.right=false;
		console.log("direction: left");
	} 

	// vertical detection
	if(gamepad.axes[1] > 0.5) {
		game.inputStates.down=true;
		game.inputStates.up=false;
	} else if(gamepad.axes[1] < -0.5) {
		game.inputStates.up=true;
		game.inputStates.down=false;
	} 

	// compute the angle. gamepad.axes[1] is the 
	// sin of the angle (values between [-1, 1]),
	// gamepad.axes[0] is the cos of the angle
	// we display the value in degree as in a regular
	// trigonometric circle, with the x axis to the right
	// and the y axis that goes up
	// The angle = arcTan(sin/cos); We inverse the sign of
	// the sin in order to have the angle in standard
	// x and y axis (y going up)
	game.inputStates.angle = Math.atan2(-gamepad.axes[1], gamepad.axes[0]);

}
//Detect button states
function checkButtons(gamepad) {
	// in this function we should add properties to the
	// inputStates object in order to use gamepad buttons
	if(gamepad === undefined) return;
	if(!gamepad.connected) return;

	for (var i = 0; i < gamepad.buttons.length; i++) {  
		var b = gamepad.buttons[i];

		if(b.pressed) {
			// do something
			console.log("button pressed");
			if(b.value !== undefined)
				// do something
				console.log("analog button pressed");
			if(i===0){
				console.log("button a press");
				game.isFireRocket = true;
			}
			if(i===5){
				if(game.numberShip > game.numberMaxShip){
					game.numberShip = game.numberMaxShip;
				}
				else{
					game.numberShip++;
				}
			}
			if(i===4){
				if(game.numberShip < 0){
					game.numberShip = 0;
				}
				else{
					game.numberShip--;
				}
			}
			if(i===9){
				game.PressKeyToContinue = true;
			}
			if(i===7){
				game.isPause = true;
			}
			if(i===6){
				game.QuitPause = true;
			}
		}
	}
}

function scangamepads() {
	var gamepads = navigator.getGamepads();

	for (var i = 0; i < gamepads.length; i++) {
		if(gamepads[i])
			gamepad = gamepads[i]; 
	}
}

function getLinkShip(numberShip) {
	return 'images/spaceship'+numberShip+'.png';
}

//On renvoie un nombre aléatoire entre une valeur min (incluse) 
//et une valeur max (exclue)
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

//On renvoie un string qui indique le nom d'une musique de maniere aléatoire
//function chooseRandomMusic() {
//var pathMusic;
//var numberHazard=parseInt(getRandomArbitrary(0,11));
//
//switch (numberHazard) {
//case 0:
//pathMusic='Aquarium'
//break;
//
//case 1:
//pathMusic='Catharsis'
//break;
//
//case 2:
//pathMusic='Cycloid'
//break;
//
//case 3:
//pathMusic='DeadAir'
//break;
//
//case 4:
//pathMusic='GeometricCity'
//break;
//
//case 5:
//pathMusic='Intolerance'
//break;
//
//case 6:
//pathMusic='Luminescence'
//break;
//
//case 7:
//pathMusic='Metaphar'
//break;
//
//case 8:
//pathMusic='MuddlingThrough'
//break;
//
//case 9:
//pathMusic='Ooparts'
//break;
//
//case 10:
//pathMusic='SlaughterHour'
//break;
//
//case 11:
//pathMusic='Toxoplasma'
//break;
//
//default:
//pathMusic='Game_Over'
//break;
//}
//return pathMusic;
//}

function chooseLevelMusic(game) {
var pathMusic;

switch (game.level) {
case 1:
pathMusic='#audioPlayer5';
break;

case 2:
pathMusic='#audioPlayer1';
break;

case 3:
pathMusic='#audioPlayer9';
break;

case 4:
pathMusic='#audioPlayer2';
break;

case 5:
pathMusic='#audioPlayer7';
break;

case 6:
pathMusic='#audioPlayer12';
break;

case 7:
pathMusic='#audioPlayer11';
break;

case 8:
pathMusic='#audioPlayer6';
break;

case 9:
pathMusic='#audioPlayer3';
break;

case 10:
pathMusic='#audioPlayer8';
break;

default:
var nbMusic = parseInt(getRandomArbitrary(1, 13));
pathMusic='#audioPlayer'+nbMusic;
break;
}
return pathMusic;
}



function Collision(box1, box2)
{
   if(true)  
          return false; 
   else
          return true; 
}
