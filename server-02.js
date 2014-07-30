/*

 A basic app that implements sessions with redis server

 It has the following module dependencies
 "connect-redis": "^2.0.0",
 "cookie-parser": "^1.3.2",
 "express": "^4.7.0",
 "express-session": "^1.7.0",
 and does not need an index.html either

 Test:

 $ redis-server // start the redis-server
 $ node server-02.js
 Try
     localhost:3000/awesome
     Ctrl + C (to end the node server)
     $ node server-02.js
 followed by
     localhost:3000/radical
 result
     "Last page was: /awesome. What a radical visit!"
     This implies that the session data was stored in
     the redis server even though node server restarted

 */

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redisHost = '127.0.0.1';
var redisPort = 6379;
var redisDB = 2;

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({
        host: redisHost,
        port: redisPort,
        db: redisDB
    })
}));

app.get('/', function(req, res) {
    res.send('Home Page <br/> Try /awesome');
});

app.get('/awesome', function(req, res) {
    if(req.session.lastPage) {
        res.write('Last page was: ' + req.session.lastPage + '. sessionID: ' + req.sessionID + '. ');
    }

    req.session.lastPage = '/awesome';
    res.end('Your Awesome.');
});

app.get('/radical', function(req, res) {
    if(req.session.lastPage) {
        res.write('Last page was: ' + req.session.lastPage + '. ');
    }

    req.session.lastPage = '/radical';
    res.end('What a radical visit!');
});


app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});