/*

Login (post userName and store in session)

- See http://stackoverflow.com/questions/24290699/socket-io-1-0-5-how-to-save-session-variables

- Start with server-01.js
- Add jsessionid from server-03.js
- Create the index.html which could post a userName
- for serving the static (css etc.), require('path') and also app.use(express.static(path.join(__dirname, 'public')));
- had to add bodyParser.json() and ensure the contentType is json both ways
- (apparently bodyParser is not good, express.json is, according to http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html)
- introduced socket.io
- but had to change app.listen(...) to server.listen(...) for it to work correctly

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



//    socket.on('join', function () {
//        var reply = JSON.stringify({action:'control', user:session.user, msg:' joined the channel' });
//        socket.emit('newJoinerConfirmation', reply);
//    });

io.use(socketHandshake({store: sessionStore, key:'jsessionid', secret:'secret', parser:cookieParser()}));
io.on('connection', function (socket) {
    console.log('connected');
    socket.on('join', function (data) {
        console.log('joined');
        console.log(socket.handshake.session.user);
        var reply = JSON.stringify({action:'control', user:socket.handshake.session.user, msg:' joined the channel' });
        io.emit('newJoinerConfirmation', reply);
    });
});


app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function () {
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
    console.log("Express server listening on " + serverName);
});
