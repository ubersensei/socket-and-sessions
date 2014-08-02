/*

 Pub-sub using socket.io
 The user name is captured from the session

 Login (post userName and store in session)

 - Start with server-01.js
 - Add jsessionid from server-03.js
 - Create the index.html which could post a userName
 - for serving the static (css etc.), require('path') and also app.use(express.static(path.join(__dirname, 'public')));
 - had to add bodyParser.json() and ensure the contentType is json both ways
 - (apparently bodyParser is not good, express.json is, according to http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html)
 - introduced socket.io
 - but had to change app.listen(...) to server.listen(...) for it to work correctly

 Additional References:
 Nathan Romano answer - http://stackoverflow.com/questions/24290699/socket-io-1-0-5-how-to-save-session-variables/24380110#comment38951230_24380110

 One more here:
 https://github.com/wcamarao/session.socket.io/issues/38

 */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var socketHandshake = require('socket.io-handshake');

var redisHost = '127.0.0.1';
var redisPort = 6379;
var redisDB = 2;
var sessionStore = new RedisStore({
    host: redisHost,
    port: redisPort,
    db: redisDB
});

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

/*
 When the user logs in (in our case, does http POST w/ user name), store it
 in Express session
 */
app.post('/user', function (req, res) {
    req.session.user = req.body.user;
    console.log("userName: " + req.session.user + " sessionid: " + req.sessionID + " and jsessionid: " + req.cookies['jsessionid']);
    res.json({"error":""});
});



io.use(socketHandshake({store: sessionStore, key:'jsessionid', secret:'secret', parser:cookieParser()}));
io.on('connection', function (socket) {
    console.log('connected');
    socket.on('join', function () {
        console.log(socket.handshake.session.user + ' joined');
        var reply = JSON.stringify({category:'join', user:socket.handshake.session.user, msg:' joined the channel' });
        io.emit('chat', reply);
    });
    socket.on('chat', function (message) {
        var chatMessage = JSON.parse(message);
        var content = chatMessage.msg;
        console.log(socket.handshake.session.user + ' pubished a chat message');
        var reply = JSON.stringify({category:'chat', user:socket.handshake.session.user, msg: content });
        io.emit('chat', reply);
    });
});





app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function () {
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
    console.log("Express server listening on " + serverName);
});
