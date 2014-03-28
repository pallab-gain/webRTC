/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io')
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

app.use(express.static(path.join(__dirname, '/public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'));
var io = io.listen(server);

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
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});


//passport js'er sob kaj ses upoer'er block'a


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

app.get('/', ensureAuthenticated, function (req, res) {
    res.sendfile('views/home.html');
});
app.get('/login', function (req, res) {
    res.sendfile('views/login.html');
});
app.get('/me', ensureAuthenticated, function (req, res) {
    res.send(req.user);
});

app.post('/startcall', ensureAuthenticated, function (req, res) {

    if (typeof req.body.id1 !== 'undefined' && typeof  req.body.id2 !== 'undefined') {
        User.start_call(req.body.id1, res.body.id2, function (err, data) {
            if (err) {
                res.send({status: false, msg: err});
            } else {
                res.send({status: true});
            }
        })
    } else {
        res.send({status: false, msg: 'cannot establiched connection'});
    }

});

app.post('/addbuddy', ensureAuthenticated, function (req, res) {
    var phone = req.body.phone;
    User.add_buddy(req.user['id'], phone, function (err, result) {
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

var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        console.log('new connection at ' + new Date().toJSON().replace('T', ' ').replace('Z', ''));
        socket.emit('on_connection', {status: true});
        socket.on('disconnect', function () {
            if (typeof socket.roomid !== 'undefined') {
                socket.leave(socket.roomid);
                User.end_call(socket.roomid, function (err, data) {
                    if (err) {
                        console.error('cannot update end_call data',err);
                    } else {
                        console.log('success to update end_call data ', data);
                    }
                })
            }
        });
        socket.on('joinroom', function (roomid) {
            socket.join(roomid);
            socket.roomid = roomid;
            io.of('/chat').in(roomid).emit('on_joinroom', {status: true});
        });
        socket.on('callrequest', function (buddyid) {
            if (typeof socket.roomid !== 'undefined') {
                User.get_people('id', socket.roomid, function (err, user) {
                    if (!err) {
                        io.of('/chat').in(buddyid).emit('on_callrequest', {status: true, user: user});
                    } else {
                        io.of('/chat').in(buddyid).emit('on_callrequest', {status: false, err: err});
                    }
                });
            }
        });
        socket.on('response_callrequest', function (buddyid, status) {
            if (typeof socket.roomid !== 'undefined') {
                User.get_people('id', socket.roomid, function (err, user) {
                    if (!err) {
                        io.of('chat').in(buddyid).emit('on_response_callrequest', {status: status, user: user});
                    } else {
                        io.of('/chat').in(buddyid).emit('on_response_callrequest', {status: false, err: err});
                    }

                });
            }
        });
        socket.on('sdp_message', function (buddyid, msg) {
            if (typeof  socket.roomid !== 'undefined') {
                io.of('/chat').in(buddyid).emit('on_sdp_message', {msg: msg, buddyid: socket.roomid});
            }
        });
    });


