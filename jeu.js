var canvas, ctx, mousePos;


// Autres joueurs
var allPlayers = {};

function init() {
  console.log("init");
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext('2d');
  
  // Les écouteurs
  canvas.addEventListener("mousedown", traiteMouseDown);//Ajoute un listeners ecoutant les clics de la souris sur le canvas
  canvas.addEventListener("mousemove", traiteMouseMove);//Ajoute un listeners ecoutant les mouvements de la souris sur le canvas
  
  anime();//Appel la fonction anime qui redessine le canvas avec un framerate de 60 images/secondes

}


//Si l'evenement clic de la souris est declenche
function traiteMouseDown(evt) {
  console.log("mousedown");//On print dans la console mousedown
}

//Si l'evenement clic de la souris est declenche
function traiteMouseMove(evt) {
  console.log("mousemove");//On print dans la console mousemove
  
  mousePos = getMousePos(canvas, evt);//On recupere la position de la sourie en prenant comme referenciel le canvas
  //console.log(mousePos.x + " " + mousePos.y); 
  
  allPlayers[username].x = mousePos.x;
  allPlayers[username].y = mousePos.y; 

  console.log("On envoie sendPos");//On print le message "On envoie sendPos"
  var pos = {'user':username, 'pos':mousePos}
  socket.emit('sendpos', pos);
}

function updatePlayerNewPos(newPos) {
  allPlayers[newPos.user].x = newPos.pos.x;
  allPlayers[newPos.user].y = newPos.pos.y;
}
// Mise à jour du tableau quand un joueur arrive
// ou se deconnecte
function updatePlayers(listOfPlayers) {
  allPlayers = listOfPlayers;
}

function drawPlayer(player) {
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 10;
  ctx.strokeRect(player.x, player.y, 100, 100);
}

function drawAllPlayers() {
  for(var name in allPlayers) {
    drawPlayer(allPlayers[name]);
  }
}

function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
   };
}

function anime() {
  if(username != undefined ) {
    // 1 On efface l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2 On dessine des objets
    drawAllPlayers();
  }
      // 4 On rappelle la fonction d'animation à 60 im/s

  requestAnimationFrame(anime);
}