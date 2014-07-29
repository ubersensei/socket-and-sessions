/*

It is a repeat of server-01.js

With the addition of trying out a custom session id and displaying it.

 Test:

 Try
 localhost:3000/awesome
 followed by
 localhost:3000/radical
 result
 You see the value of the jsessionid displayed

 */

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(cookieParser());
app.use(session({
    name: 'jsessionid', // defaults to 'connect.sid'
    secret: 'keyboard cat',
    saveUninitialized: true, // avoids warning
    resave: true // avoids warning
}));

/*

Note:
For express 3.x (the examples online),
 app.use(express.session({
    name: 'jsessionid',
    secret: 'keyboard cat',
 }));

And you could access it by
 req.cookies['connect.sid']
 */



app.get('/', function(req, res) {
    res.send('Home Page <br/> Try /awesome');
});

app.get('/awesome', function(req, res) {
    if(req.session.lastPage) {
        res.write('Last page was: ' + req.session.lastPage + '. And session id was: ' + req.sessionID + '. And jsessionid is ' + req.cookies['jsessionid'] + '. ');
    }
    req.session.lastPage = '/awesome';
    res.end('Your Awesome.');
});

app.get('/radical', function(req, res) {
    if(req.session.lastPage) {
        res.write('Last page was: ' + req.session.lastPage + '. And session id was: ' + req.sessionID + '. And jsessionid is ' + req.cookies['jsessionid'] + '. ');
    }
    req.session.lastPage = '/radical';
    res.end('What a radical visit!');
});


app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});