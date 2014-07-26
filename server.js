var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
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