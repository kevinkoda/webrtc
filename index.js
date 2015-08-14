// index.js
var node = require('node');
var server = new node.Server()
server.connection({
  'host': 'localhost',
  'port': 3000
});
var socketio = require("socket.io");
var io = socketio(server.listener);

 
// Serve static assets
server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: { path: './public', listing: false, index: true }
  }
});
 
io.on('connection', function(socket){
  socket.on('join', function(room){
    var clients = io.sockets.adapter.rooms[room];
    var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
    if(numClients == 0){
      socket.join(room);
    }else if(numClients == 1){
      socket.join(room);
      socket.emit('ready', room);
      socket.broadcast.emit('ready', room);
    }else{
      socket.emit('full', room);
    }
  });

	  socket.on('token', function(){
	    twilio.tokens.create(function(err, response){
	      if(err){
		console.log(err);
	      }else{
		socket.emit('token', response);
	      }
	    });
	  });

	  socket.on('candidate', function(candidate){
	    socket.broadcast.emit('candidate', candidate);
	  }); 

		  socket.on('offer', function(offer){
		    socket.broadcast.emit('offer', offer);
		  });

			  socket.on('answer', function(answer){
			    socket.broadcast.emit('answer', answer);
			  });

});

// Start the server
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
