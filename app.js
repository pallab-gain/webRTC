/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/route');
var http = require('http');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use('public', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
passport.use(new FacebookStrategy({
        clientID: '282063648620862',
        clientSecret: '9ed9d41a306c2a89cbf8eb282e6ea02a',
        callbackURL: "http://www.example.com/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOrCreate('test', function (err, user) {
            if (err) {
                return done(err);
            }
            done(null, user);
        });
    }
));

app.get('/home', routes.home);
app.get('/login', routes.login);


app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/home',
        failureRedirect: '/login' }));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
