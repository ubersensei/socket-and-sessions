/*

 Using redis for pub-sub
 Note that this way of starting the node/socket.js works only locally.

 */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require("redis");
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var socketHandshake = require('socket.io-handshake');

var redisHost = '127.0.0.1';
var redisPort = 6379;
var redisDB = 2;

/*
 Also use Redis for Session Store. Redis will keep all Express sessions in it.
 */
//var RedisStore = require('connect-redis')(express),
var rClient = redis.createClient(redisPort, redisHost);
var sessionStore = new RedisStore({client:rClient});

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    name: 'jsessionid', // access using req.cookies['jsessionid']
    secret: 'secret',
    saveUninitialized: true, // avoids warning
    resave: true, // avoids warning
    store: sessionStore
}));


app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});


app.post('/user', function (req, res) {
    req.session.user = req.body.user;
    console.log("userName: " + req.session.user + " sessionid: " + req.sessionID + " and jsessionid: " + req.cookies['jsessionid']);
    res.json({"error":""});
});


var sub = redis.createClient(redisPort, redisHost);
var pub = redis.createClient(redisPort, redisHost);
sub.subscribe('chat-redis');

io.use(socketHandshake({store: sessionStore, key:'jsessionid', secret:'secret', parser:cookieParser()}));
io.on('connection', function (socket) {
    console.log('connected');
    socket.on('join', function () {
        console.log(socket.handshake.session.user + ' joined');
        var reply = JSON.stringify({category:'join', user:socket.handshake.session.user, msg:' joined the channel' });
//        io.emit('chat', reply);
        pub.publish('chat-redis', reply);
    });
    socket.on('chat', function (message) {
        var chatMessage = JSON.parse(message);
        var content = chatMessage.msg;
        console.log(socket.handshake.session.user + ' pubished a chat message');
        var reply = JSON.stringify({category:'chat', user:socket.handshake.session.user, msg: content });
//        io.emit('chat', reply);
        pub.publish('chat-redis', reply);
    });

});

sub.on('message', function (channel, message) {
    console.log('got subbed');
//        io.emit(channel, message);
    io.emit('chat', message);
});


app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function () {
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
    console.log("Express server listening on " + serverName);
});
