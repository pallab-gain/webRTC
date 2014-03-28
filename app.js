/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/route');
var http = require('http');
var path = require('path');
var flash = require('connect-flash')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

//all models
var userController = require('./models/model');
var User = new userController();

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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use('public', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.find_by_id(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.is_valid(username, password, function (err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            else {
                return done(null, {id: user.id});
            }
        });

    }
));

app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);
app.post('/addbuddy', ensureAuthenticated, function (req, res) {
    var phone = req.body.phone;
    User.add_buddy(req.user['id'],phone, function (err, result) {
        var response = {status: null, data: null};
        if (err) {
            response.status = false;
            response.data = err;
            res.send(response);
        } else {
            response.status = true;
            response.data = result;
            res.send(response);
        }
    })
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

app.get('/', ensureAuthenticated, routes.home);
app.get('/login', routes.login);

