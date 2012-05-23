var socket = io.connect('http://fodbold.zno.dk:3000');

$(document).ready(function() {

  socket.on('state', function(state) {
    showPlayers(state);
    updateUI(state);
    setTitle(state);
    playSound(state);
  });
  
  $('#playButton').click(function() {
    var name = $('#name').val();
    var player = { name: name };
    socket.emit('addPlayer', player);
  });
  
  $('#name').val(window.localStorage["name"]);
  
  $('#name').change(function() {
    window.localStorage["name"] = $('#name').val();
  });
  
});

function showPlayers(state) {
  $('#players').html('');
  state.players.map(function(player) { $('#players').append('<li>' + htmlEscape(player.name) + '</li>'); });
}

function updateUI(state) {
  $('#playButton').prop('disabled', state.start);
  $('#players').css('background-color', state.start ? '#bada55' : '#eee');
}

function playSound(state) {
  if (state.notify) {
    $('#sound').trigger("play");
  }
}

function setTitle(state) {
  if (!state.notify)
    return; // avoid blue app tab in firefox on load

  var title;
  switch (state.players.length) {
    case 0: 
      title = "Bordfodbold @ cBeach";
      break;
    case 1:
      title = "1 spiller! | Bordfodbold @ cBeach"
      break;
    default:
      title = state.players.length + " spillere! | Bordfodbold @ cBeach";
      break;
  }
  document.title = title;
}

function htmlEscape(text) {
  return text.replace(/[&<>"'`]/g, function (chr) {
    return '&#' + chr.charCodeAt(0) + ';';
  });
}