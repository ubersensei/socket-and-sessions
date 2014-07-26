/*

A basic app that employs sessions.

It has the following module dependencies
    "cookie-parser": "^1.3.2",
    "express": "^4.7.0",
    "express-session": "^1.7.0",
and does not need an index.html either

Test:

Try
    localhost:3000/awesome
followed by
    localhost:3000/radical
result
    "Last page was: /awesome. What a radical visit!"

*/

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true, // avoids warning
    resave: true // avoids warning
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
    console.log('Express server listening on port ' + server.address().port);
});