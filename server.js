var http = require('http');
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
        res.write('Last page was: ' + req.session.lastPage + '. ');
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
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
    console.log('Express server listening on servername: '+ serverName +' + port: ' + server.address().port);
});
