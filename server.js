var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 8000);
console.log('server running...');


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// dosconect
	socket.on('disconnect', function(data){
		// if(!socket.username)return;
		updataUsername();
		users.splice(users.indexOf(socket), 1);
		connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected: %s socket Disconnected', connections.length);
	});
	// send message
	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});
	// new user
	socket.on('new user', function(data, callbalc){
		callbalc(true);
		socket.username = data;
		users.push(socket.username);
		updataUsername();
	})

	function updataUsername(){
		io.sockets.emit('get users', users);
	}
});
