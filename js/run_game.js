/**
 * 
 */
//Create the starfield.
var container = document.getElementById('starfield');
var containerfps = document.getElementById('fps');
var starfield = new Starfield();
starfield.initialise(container, containerfps);
starfield.start();

//  Setup the canvas.
var canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;

//  Create the game.
var game = new Game();

//  Initialise it with the game canvas.
game.initialise(canvas);

//  Start the game.
game.start();

//  Listen for keyboard events.
window.addEventListener("keydown", function keydown(e) {
	var keycode = e.which || window.event.keycode;
	//  Supress further processing of left/right/space (37/39/32)
	if (keycode == 37 || keycode == 39 || keycode == 32) {
		e.preventDefault();
	}
	game.keyDown(keycode);
});
window.addEventListener("keyup", function keydown(e) {
	var keycode = e.which || window.event.keycode;
	game.keyUp(keycode);
});

function toggleMute() {
	game.mute();
	document.getElementById("muteLink").innerText = game.sounds.mute ? "unmute"
			: "mute";
}