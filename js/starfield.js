/*
	Starfield lets you take a div and turn it into a starfield.

 */

//Define the starfield class.
function Starfield() {
	/******ATTRIBUTES******/

	this.canvas = null;
	this.width = 0;
	this.width = 0;
	this.minVelocity = 15;
	this.maxVelocity = 30;
	this.stars = 200;
	this.galaxies = 0;
	this.galaxie1s = 0;
	this.asteroids = 0;
	this.asteroid1s = 0;
	this.asteroid2s = 0;
	this.asteroid3s = 0;
	this.randomSpaceObjects = 1;
	this.intervalId = 0;
	this.containerDiv = null;

	this.fps = 30;
	this.fpsdiv = null;
	var frameCount = 0;
	var lastTime;
	this.fps_measure;
}

/******CLASS METHODS FOR CLASS STARFIELD******/

//The main function - initialises the starfield.
//Take a parameter div. The div is where the starfield will be create.
Starfield.prototype.initialise = function(div, pfpsdiv) {
	var self = this; // Store the current Starfield in a variable.

	//	Store the div.
	this.containerDiv = div;
	this.fpsdiv = pfpsdiv;
	self.width = window.innerWidth; // Adapt the width of the starfield with the width of the window.
	self.height = window.innerHeight; // Adapt the height of the starfield with the height of the window.

	// If we resize the window, we must resize the starfield too.
	window.onresize = function(event) {
		self.width = window.innerWidth; // Adapt the width of the starfield with the width of the window.
		self.height = window.innerHeight; // Adapt the height of the starfield with the height of the window.
		self.canvas.width = self.width; // Initialize attribute.
		self.canvas.height = self.height; // Initialize attribute.
		self.draw(); //draw the starfield
	}

	//	Create the canvas.
	var canvas = document.createElement('canvas'); // Create a canvas element in the document.
	div.appendChild(canvas); // The canvas element will be the child of the dic element.
	this.canvas = canvas; // Initialise the attribute canvas with the canvas element we have just create.
	this.canvas.width = this.width; // Adapt the width of the attrubute canvas with the width of the canvas we have create.
	this.canvas.height = this.height; // Adapt the width of the attrubute canvas with the width of the canvas we have create.
};

//Define the start function for the class Starfield.
Starfield.prototype.start = function() {

	//	Create the stars.
	var stars = []; // Initialize a vector of Star.
	// Fill the vector with Star (See the definition of the class Star for more details).
	for(var i=0; i<this.stars; i++) {
		stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1,
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.stars = stars; // Initialize attribute.
	
//	Create the galaxie1s.
	var galaxie1s = []; // Initialize a vector of Galaxie.
	// Fill the vector with Galaxie (See the definition of the class Galaxie for more details).
	for(var i=0; i<this.galaxie1s; i++) {
		galaxie1s[i] = new Galaxie1(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,30),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity-5);
	}
	this.galaxie1s = galaxie1s; // Initialize attribute.
	
//	Create the galaxies.
	var galaxies = []; // Initialize a vector of Galaxie.
	// Fill the vector with Galaxie (See the definition of the class Galaxie for more details).
	for(var i=0; i<this.galaxies; i++) {
		galaxies[i] = new Galaxie(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,30),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.galaxies = galaxies; // Initialize attribute.
	
//	Create the asteroids.
	var asteroids = []; // Initialize a vector of Asteroid.
	// Fill the vector with Asteroid (See the definition of the class Asteroid for more details).
	for(var i=0; i<this.asteroids; i++) {
		asteroids[i] = new Asteroid(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,20),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.asteroids = asteroids; // Initialize attribute.
	
//	Create the asteroid1s.
	var asteroid1s = []; // Initialize a vector of Asteroid.
	// Fill the vector with Asteroid (See the definition of the class Asteroid for more details).
	for(var i=0; i<this.asteroid1s; i++) {
		asteroid1s[i] = new Asteroid1(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,20),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.asteroid1s = asteroid1s; // Initialize attribute.
	
//	Create the asteroid2s.
	var asteroid2s = []; // Initialize a vector of Asteroid.
	// Fill the vector with Asteroid (See the definition of the class Asteroid for more details).
	for(var i=0; i<this.asteroid2s; i++) {
		asteroid2s[i] = new Asteroid2(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,20),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.asteroid2s = asteroid2s; // Initialize attribute.
	
//	Create the asteroid3s.
	var asteroid3s = []; // Initialize a vector of Asteroid.
	// Fill the vector with Asteroid (See the definition of the class Asteroid for more details).
	for(var i=0; i<this.asteroid3s; i++) {
		asteroid3s[i] = new Asteroid3(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,20),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.asteroid3s = asteroid3s; // Initialize attribute.
	
//	Create the randomSpaceObjects.
	var randomSpaceObjects = []; // Initialize a vector of RandomSpaceObject.
	// Fill the vector with RandomSpaceObject (See the definition of the class RandomSpaceObject for more details).
	for(var i=0; i<this.randomSpaceObjects; i++) {
		randomSpaceObjects[i] = new RandomSpaceObject(Math.random()*this.width, Math.random()*this.height, getRandomArbitrary(1,20),
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity, chooseObject());
	}
	this.randomSpaceObjects = randomSpaceObjects; // Initialize attribute.

	var self = this; // Self is a Starfield.

	var animationLoop = function(time){
		//main function, called each frame 
		self.update(); // Move the stars in the space.
		self.draw();	 // draw the stars in the space.
		self.measureFPS(time);
		// call the animation loop every 1/60th of second
		this.intervalId = requestAnimationFrame(animationLoop);
	};

	this.intervalId = requestAnimationFrame(animationLoop);

//	//	Start the timer.
//	this.intervalId = setTimeout(function() {
//	self.update(); // Move the stars in the space.
//	self.draw();	 // draw the stars in the space.
//	}, 1000 / this.fps);
};

//Define the stop function for the class Starfield.
Starfield.prototype.stop = function() {
	//	clearTimeout(this.intervalId);
	if (this.intervalId) {
		cancelAnimationFrame(this.intervalId);
	}
};

//Define the update function for the class Starfield. 
//This function moves the stars in the space.
Starfield.prototype.update = function() {
	var dt = 1 / this.fps; // Time between two frames.

	// For each stars, move it on the y axis (a lot if the star has a graet velocity and a little otherwise).
	for(var i=0; i<this.stars.length; i++) {
		var star = this.stars[i]; // Select the current star.
		star.y += dt * star.velocity; // Move the star on the y axis.
		//	If the star has moved from the bottom of the screen, spawn it at the top.
		if(star.y > this.height) {
			// The current star wich has mave out of the screen is replace by a new star at the top of the screen. 
			this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1, 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each galaxie1s, move it on the y axis (a lot if the galaxies has a graet velocity and a little otherwise).
	for(var i=0; i<this.galaxie1s.length; i++) {
		var galaxie1 = this.galaxie1s[i]; // Select the current galaxies.
		galaxie1.y += dt * galaxie1.velocity; // Move the galaxie on the y axis.
		//	If the galaxies has moved from the bottom of the screen, spawn it at the top.
		if(galaxie1.y > this.height) {
			// The current galaxies wich has mave out of the screen is replace by a new star at the top of the screen. 
			this.galaxie1s[i] = new Galaxie1(Math.random()*this.width, 0, getRandomArbitrary(1,30), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each galaxies, move it on the y axis (a lot if the galaxies has a graet velocity and a little otherwise).
	for(var i=0; i<this.galaxies.length; i++) {
		var galaxie = this.galaxies[i]; // Select the current galaxies.
		galaxie.y += dt * galaxie.velocity; // Move the galaxie on the y axis.
		//	If the galaxies has moved from the bottom of the screen, spawn it at the top.
		if(galaxie.y > this.height) {
			// The current galaxies wich has mave out of the screen is replace by a new star at the top of the screen. 
			this.galaxies[i] = new Galaxie(Math.random()*this.width, 0, getRandomArbitrary(1,30), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each asteroids, move it on the y axis (a lot if the galaxies has a graet velocity and a little otherwise).
	for(var i=0; i<this.asteroids.length; i++) {
		var asteroid = this.asteroids[i]; // Select the current asteroids.
		asteroid.y += dt * asteroid.velocity; // Move the asteroids on the y axis.
		//	If the asteroids has moved from the bottom of the screen, spawn it at the top.
		if(asteroid.y > this.height) {
			// The current asteroids wich has mave out of the screen is replace by a new star at the top of the screen. 
			this.asteroids[i] = new Asteroid(Math.random()*this.width, 0, getRandomArbitrary(1,20), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each asteroid1s, move it on the y axis (a lot if the galaxies has a graet velocity and a little otherwise).
	for(var i=0; i<this.asteroid1s.length; i++) {
		var asteroid1 = this.asteroid1s[i]; // Select the current asteroids.
		asteroid1.y += dt * asteroid1.velocity; // Move the asteroids on the y axis.
		//	If the asteroids has moved from the bottom of the screen, spawn it at the top.
		if(asteroid1.y > this.height) {
			// The current asteroids wich has mave out of the screen is replace by a new star at the top of the screen. 
			this.asteroid1s[i] = new Asteroid1(Math.random()*this.width, 0, getRandomArbitrary(1,20), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each asteroid2s, move it on the y axis (a lot if the galaxies has a graet velocity and a little otherwise).
	for(var i=0; i<this.asteroid2s.length; i++) {
		var asteroid2 = this.asteroid2s[i]; // Select the current asteroids.
		asteroid2.y += dt * asteroid2.velocity; // Move the asteroids on the y axis.
		//	If the asteroids has moved from the bottom of the screen, spawn it at the top.
		if(asteroid2.y > this.height) {
			// The current asteroids wich has move out of the screen is replace by a new star at the top of the screen. 
			this.asteroid2s[i] = new Asteroid2(Math.random()*this.width, 0, getRandomArbitrary(1,20), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each asteroid3s, move it on the y axis (a lot if the galaxies has a great velocity and a little otherwise).
	for(var i=0; i<this.asteroid3s.length; i++) {
		var asteroid3 = this.asteroid3s[i]; // Select the current asteroids.
		asteroid3.y += dt * asteroid3.velocity; // Move the asteroids on the y axis.
		//	If the asteroids has moved from the bottom of the screen, spawn it at the top.
		if(asteroid3.y > this.height) {
			// The current asteroids wich has move out of the screen is replace by a new star at the top of the screen. 
			this.asteroid3s[i] = new Asteroid3(Math.random()*this.width, 0, getRandomArbitrary(1,20), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
	
	// For each randomSpaceObjects, move it on the y axis (a lot if the randomSpaceObjects has a great velocity and a little otherwise).
	for(var i=0; i<this.randomSpaceObjects.length; i++) {
		var randomSpaceObject = this.randomSpaceObjects[i]; // Select the current asteroids.
		randomSpaceObject.y += dt * randomSpaceObject.velocity; // Move the asteroids on the y axis.
		//	If the asteroids has moved from the bottom of the screen, spawn it at the top.
		if(randomSpaceObject.y > this.height) {
			// The current asteroids wich has move out of the screen is replace by a new star at the top of the screen. 
			this.randomSpaceObjects[i] = new RandomSpaceObject(Math.random()*this.width, 0, getRandomArbitrary(1,20), 
					(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity, chooseObject());
		}
	}
};

//Define the draw function for the class Starfield.
//This function draw the stars in the space.
Starfield.prototype.draw = function() {

	//	Get the drawing context.
	var ctx = this.canvas.getContext("2d"); // We just want 2D.

	//	Draw the black background for the space.
	ctx.fillStyle = '#000000'; // The background is black.
	ctx.fillRect(0, 0, this.width, this.height); // Draw a rect for the space.
	
//	Draw galaxie1s.
	// For each galaxie1s present in the Starfield, draw it.
	for(var i=0; i<this.galaxie1s.length;i++) {
		var galaxie1 = this.galaxie1s[i];
		galaxie1Img = new Image();
		galaxie1Img.src = 'http://localhost/Raystorm/images/galaxie1.gif';
        ctx.drawImage(galaxie1Img, galaxie1.x, galaxie1.y, galaxie1.size+30, galaxie1.size+30);
	}
	
//	Draw galaxies.
	// For each galaxies present in the Starfield, draw it.
	for(var i=0; i<this.galaxies.length;i++) {
		var galaxie = this.galaxies[i];
		galaxieImg = new Image();
		galaxieImg.src = 'http://localhost/Raystorm/images/galaxieAnime.gif';
        ctx.drawImage(galaxieImg, galaxie.x, galaxie.y, galaxie.size+30, galaxie.size+30);
	}
	
//	Draw randomSpaceObjects.
	// For each randomSpaceObjects present in the Starfield, draw it.
	for(var i=0; i<this.randomSpaceObjects.length;i++) {
		var randomSpaceObject = this.randomSpaceObjects[i];
		randomSpaceObjectImg = new Image();
		randomSpaceObjectImg.src = randomSpaceObject.nature;
        ctx.drawImage(randomSpaceObjectImg, randomSpaceObject.x, randomSpaceObject.y, randomSpaceObject.size+20, randomSpaceObject.size+20);
	}
	
	//	Draw stars.
	ctx.fillStyle = '#ffffff'; // The stars are white
	// For each stars present in the Starfield, draw it.
	for(var i=0; i<this.stars.length;i++) {
		var star = this.stars[i];
		ctx.fillRect(star.x, star.y, star.size, star.size); // Draw the current star.
	}
	
//	Draw asteroids.
	// For each asteroids present in the Starfield, draw it.
	for(var i=0; i<this.asteroids.length;i++) {
		var asteroid = this.asteroids[i];
		asteroidImg = new Image();
		asteroidImg.src = 'http://localhost/Raystorm/images/asteroide.png';
        ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.size+20, asteroid.size+20);
	}
	
//	Draw asteroid1s.
	// For each asteroid1s present in the Starfield, draw it.
	for(var i=0; i<this.asteroid1s.length;i++) {
		var asteroid1 = this.asteroid1s[i];
		asteroid1Img = new Image();
		asteroid1Img.src = 'http://localhost/Raystorm/images/asteroide1.png';
        ctx.drawImage(asteroid1Img, asteroid1.x, asteroid1.y, asteroid1.size+20, asteroid1.size+20);
	}
	
//	Draw asteroid2s.
	// For each asteroid2s present in the Starfield, draw it.
	for(var i=0; i<this.asteroid2s.length;i++) {
		var asteroid2 = this.asteroid2s[i];
		asteroid2Img = new Image();
		asteroid2Img.src = 'http://localhost/Raystorm/images/asteroide2.png';
        ctx.drawImage(asteroid2Img, asteroid2.x, asteroid2.y, asteroid2.size+20, asteroid2.size+20);
	}
	
//	Draw asteroid3s.
	// For each asteroid3s present in the Starfield, draw it.
	for(var i=0; i<this.asteroid3s.length;i++) {
		var asteroid3 = this.asteroid3s[i];
		asteroid3Img = new Image();
		asteroid3Img.src = 'http://localhost/Raystorm/images/AsteroideAnime1.gif';
        ctx.drawImage(asteroid3Img, asteroid3.x, asteroid3.y, asteroid3.size+20, asteroid3.size+20);
	}
	

};

Starfield.prototype.measureFPS = function(newTime){
	// test for the very first invocation
	if(this.lastTime === undefined) {
	this.lastTime = newTime;
	return;
	}
	// calculate the delta between last & current frame
	var diffTime = newTime - this.lastTime;
	if (diffTime >= 1000) {
		this.fps_measure = this.frameCount;
		this.frameCount = 0;
		this.lastTime = newTime;
	}
	// and display it in an element we appended to the
	// document in the start() function
	this.fpsdiv.innerHTML = 'FPS: ' + this.fps_measure;
	this.frameCount++;
};

//Define the Star class.
function Star(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the space.
	this.y = y; // y position in the space.
	this.size = size; // Size of the star.
	this.velocity = velocity; // Velocity of the star.
}

//Define the Galaxie class.
function Galaxie(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Galaxie.
	this.y = y; // y position in the Galaxie.
	this.size = size; // Size of the Galaxie.
	this.velocity = velocity; // Velocity of the Galaxie.
}

//Define the Galaxie1 class.
function Galaxie1(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Galaxie.
	this.y = y; // y position in the Galaxie.
	this.size = size; // Size of the Galaxie.
	this.velocity = velocity; // Velocity of the Galaxie.
}

//Define the Asteroid class.
function Asteroid(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Asteroid.
	this.y = y; // y position in the Asteroid.
	this.size = size; // Size of the Asteroid.
	this.velocity = velocity; // Velocity of the Asteroid.
}

//Define the Asteroid1 class.
function Asteroid1(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Asteroid1.
	this.y = y; // y position in the Asteroid1.
	this.size = size; // Size of the Asteroid1.
	this.velocity = velocity; // Velocity of the Asteroid1.
}

//Define the Asteroid2 class.
function Asteroid2(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Asteroid2.
	this.y = y; // y position in the Asteroid2.
	this.size = size; // Size of the Asteroid2.
	this.velocity = velocity; // Velocity of the Asteroid2.
}

//Define the Asteroid3 class.
function Asteroid3(x, y, size, velocity) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Asteroid3.
	this.y = y; // y position in the Asteroid3.
	this.size = size; // Size of the Asteroid3.
	this.velocity = velocity; // Velocity of the Asteroid3.
}

//Define the RandomSpaceObject class.
function RandomSpaceObject(x, y, size, velocity, nature) {
	/******ATTRIBUTE******/
	this.x = x; // x position in the Asteroid3.
	this.y = y; // y position in the Asteroid3.
	this.size = size; // Size of the Asteroid3.
	this.velocity = velocity; // Velocity of the Asteroid3.
	this.nature = nature; // Nature of the RandomSpaceObject.
}

//On renvoie un nombre aléatoire entre une valeur min (incluse) 
//et une valeur max (exclue)
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

//On renvoie un string qui indique le path d'une image et qui sera utiliser pour déterminer la nature d'un objet de maniere aléatoire
function chooseObject() {
	var pathImage;
	var numberHazard=parseInt(getRandomArbitrary(0,68));
	
	switch (numberHazard) {
		case 0:
			pathImage='http://localhost/Raystorm/images/planete1.png'
			break;
			
		case 1:
			pathImage='http://localhost/Raystorm/images/planete2.png'
			break;
			
		case 2:
			pathImage='http://localhost/Raystorm/images/planete3.png'
			break;
			
		case 3:
			pathImage='http://localhost/Raystorm/images/planete4.png'
			break;
			
		case 4:
			pathImage='http://localhost/Raystorm/images/planete5.png'
			break;
			
		case 5:
			pathImage='http://localhost/Raystorm/images/planete6.png'
			break;
			
		case 6:
			pathImage='http://localhost/Raystorm/images/planete7.gif'
			break;
			
		case 7:
			pathImage='http://localhost/Raystorm/images/planete8.gif'
			break;
			
		case 8:
			pathImage='http://localhost/Raystorm/images/planete9.png'
			break;
			
		case 9:
			pathImage='http://localhost/Raystorm/images/planete10.gif'
			break;
			
		case 10:
			pathImage='http://localhost/Raystorm/images/planeteAnime.gif'
			break;
			
		case 11:
			pathImage='http://localhost/Raystorm/images/satellite.png'
			break;
			
		case 12:
			pathImage='http://localhost/Raystorm/images/spacestation.png'
			break;
			
		case 13:
			pathImage='http://localhost/Raystorm/images/asteroide3.png'
			break;
			
		case 14:
			pathImage='http://localhost/Raystorm/images/asteroide4.png'
			break;
		
		case 15:
			pathImage='http://localhost/Raystorm/images/asteroide5.png'
			break;
			
		case 16:
			pathImage='http://localhost/Raystorm/images/asteroide6.png'
			break;
			
		case 17:
			pathImage='http://localhost/Raystorm/images/asteroide7.png'
			break;
			
		case 18:
			pathImage='http://localhost/Raystorm/images/asteroide8.png'
			break;
			
		case 19:
			pathImage='http://localhost/Raystorm/images/asteroide9.png'
			break;
			
		case 20:
			pathImage='http://localhost/Raystorm/images/asteroide10.png'
			break;
			
		case 21:
			pathImage='http://localhost/Raystorm/images/asteroide11.png'
			break;
			
		case 22:
			pathImage='http://localhost/Raystorm/images/planete11.png'
			break;
			
		case 23:
			pathImage='http://localhost/Raystorm/images/planete12.png'
			break;
			
		case 24:
			pathImage='http://localhost/Raystorm/images/planete13.png'
			break;
			
		case 25:
			pathImage='http://localhost/Raystorm/images/planete14.png'
			break;
			
		case 26:
			pathImage='http://localhost/Raystorm/images/planete15.png'
			break;
			
		case 27:
			pathImage='http://localhost/Raystorm/images/planete16.png'
			break;
			
		case 28:
			pathImage='http://localhost/Raystorm/images/planete17.png'
			break;
			
		case 29:
			pathImage='http://localhost/Raystorm/images/planete18.png'
			break;
			
		case 30:
			pathImage='http://localhost/Raystorm/images/planete19.png'
			break;
			
		case 31:
			pathImage='http://localhost/Raystorm/images/planete20.png'
			break;
			
		case 32:
			pathImage='http://localhost/Raystorm/images/planete21.png'
			break;
			
		case 33:
			pathImage='http://localhost/Raystorm/images/planete22.png'
			break;
			
		case 34:
			pathImage='http://localhost/Raystorm/images/planete23.png'
			break;
			
		case 35:
			pathImage='http://localhost/Raystorm/images/planete24.png'
			break;
			
		case 36:
			pathImage='http://localhost/Raystorm/images/planete25.png'
			break;
			
		case 37:
			pathImage='http://localhost/Raystorm/images/planete26.png'
			break;
			
		case 38:
			pathImage='http://localhost/Raystorm/images/planete27.png'
			break;
			
		case 39:
			pathImage='http://localhost/Raystorm/images/planete28.png'
			break;
			
		case 40:
			pathImage='http://localhost/Raystorm/images/satellite1.png'
			break;
			
		case 41:
			pathImage='http://localhost/Raystorm/images/satellite2.png'
			break;
			
		case 42:
			pathImage='http://localhost/Raystorm/images/satellite3.png'
			break;
			
		case 43:
			pathImage='http://localhost/Raystorm/images/planete29.gif'
			break;
			
		case 44:
			pathImage='http://localhost/Raystorm/images/planete30.png'
			break;
			
		case 45:
			pathImage='http://localhost/Raystorm/images/planete31.png'
			break;
			
		case 46:
			pathImage='http://localhost/Raystorm/images/planete32.png'
			break;
			
		case 47:
			pathImage='http://localhost/Raystorm/images/planete33.png'
			break;
			
		case 48:
			pathImage='http://localhost/Raystorm/images/planete34.png'
			break;
			
		case 49:
			pathImage='http://localhost/Raystorm/images/planete35.png'
			break;
			
		case 50:
			pathImage='http://localhost/Raystorm/images/planete36.png'
			break;
			
		case 51:
			pathImage='http://localhost/Raystorm/images/planete37.png'
			break;
			
		case 52:
			pathImage='http://localhost/Raystorm/images/planete38.png'
			break;
			
		case 53:
			pathImage='http://localhost/Raystorm/images/planete39.png'
			break;
			
		case 54:
			pathImage='http://localhost/Raystorm/images/planete40.png'
			break;
			
		case 55:
			pathImage='http://localhost/Raystorm/images/planete41.png'
			break;
			
		case 56:
			pathImage='http://localhost/Raystorm/images/planete42.png'
			break;
			
		case 57:
			pathImage='http://localhost/Raystorm/images/planete43.png'
			break;
			
		case 58:
			pathImage='http://localhost/Raystorm/images/planete44.png'
			break;
			
		case 59:
			pathImage='http://localhost/Raystorm/images/planete45.png'
			break;
			
		case 60:
			pathImage='http://localhost/Raystorm/images/planete46.png'
			break;
			
		case 61:
			pathImage='http://localhost/Raystorm/images/planeteAnime1.gif'
			break;
			
		case 62:
			pathImage='http://localhost/Raystorm/images/planeteAnime2.gif'
			break;
			
		case 63:
			pathImage='http://localhost/Raystorm/images/planeteAnime3.gif'
			break;
			
		case 64:
			pathImage='http://localhost/Raystorm/images/lune1.gif'
			break;
			
		case 65:
			pathImage='http://localhost/Raystorm/images/lune2.png'
			break;
			
		case 66:
			pathImage='http://localhost/Raystorm/images/lune3.png'
			break;
			
		case 67:
			pathImage='http://localhost/Raystorm/images/lune4.gif'
			break;
			
		case 68:
			pathImage='http://localhost/Raystorm/images/lune5.gif'
			break;
			

		default:
			pathImage='http://localhost/Raystorm/images/planete2.png'
			break;
	}
	return pathImage;
}