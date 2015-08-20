var socket = io.connect('http://' + document.domain + ':' + location.port + '/wristband');

socket.on('connect', function () {
  console.log('connected');
  socket.emit('joined');
});

socket.on('response', function (msg) {
  console.log('Received:', msg.data);
});