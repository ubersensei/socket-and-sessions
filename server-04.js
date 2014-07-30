/*

 Login (post userName and store in session)

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

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    name: 'jsessionid', // access using req.cookies['jsessionid']
    secret: 'keyboard cat',
    saveUninitialized: true, // avoids warning
    resave: true // avoids warning
}));


app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});


/*
 When the user logs in (in our case, does http POST w/ user name), store it
 in Express session
 */
app.post('/user', function (req, res) {
    req.session.user = req.body.user;
    console.log("set the session value for user: " + req.session.user);
    res.json({"error":""});
});

//var server = app.listen(app.get('port'), function() {
//    console.log('Express server listening on port ' + server.address().port);
//});
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function () {
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
    console.log("Express server listening on " + serverName);
});
