var io = require('socket.io').listen(3000);

var players = new Array();
var gameStarting = false;

io.sockets.on('connection', function (socket) {

  sendState(socket);

  socket.on('addPlayer', function (player) {
    addPlayer(player);
    socket.broadcast.emit('addPlayer', player);
  });

});

function addPlayer(player) {
  if (gameStarting)
    return;

  players.push(player);
  if (players.length >= 4)
    startGame();
    
  sendStateToAll(true);
}

function sendStateToAll(notify) {
  sendState(io.sockets, notify);
}

function sendState(socket, notify) {
  var state = {
    start: gameStarting,
    players: players,
    notify: notify
  };
  socket.emit('state', state);
}

function startGame() {
  gameStarting = true;
  players = players.slice(0, 4);
  setTimeout(reset, 20000);
}

function reset() {
  players = new Array();
  gameStarting = false;
  sendStateToAll();    
}