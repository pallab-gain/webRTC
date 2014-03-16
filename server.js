var User = require('./webrtc/model/user');
var userDB = new User();

var PORT = 9090;
var express = require('express'), app = express();
var server = app.listen(PORT);
var io = require('socket.io').listen(server); // this tells socket io to user express server

app.configure(function () {
    app.use(express.bodyParser());
    app.use('/css', express.static(__dirname + '/webrtc/view/css'));
    app.use('/js', express.static(__dirname + '/webrtc/view/js'));
    app.use('/fonts', express.static(__dirname + '/webrtc/view/fonts'));
    app.use('/html', express.static(__dirname + '/webrtc/view/html'));

    app.set('html', __dirname + '/webrtc/view/html');
});

app.get('/', function (req, res) {
    res.sendfile(app.get('html') + '/index.html');
});
app.post('/get_user_info', function (req, res) {
    var attr = req.body;
    if (attr.hasOwnProperty('token_id')) {
        userDB.find_user_by_token(attr.token_id, function (err, user) {
            if (err) {
                return res.send({status: false, data: err});
            } else {
                return res.send({status: true, data: user});
            }
        });
    }
    else {
        return res.send({status: false, data: null});
    }
});
app.post('/check-valid-user', function (req, res) {
    var attr = req.body;
    if (attr.hasOwnProperty('phone') && attr.hasOwnProperty('password')) {
        var options = {phone: attr.phone, password: attr.password};
        userDB.is_valid_user(options, function (err, data) {
            if (err) {
                return res.send({status: false, data: err});
            } else {
                return res.send({status: true, data: {user_token: data._id, user_phone: data.phone}});
            }
        })
    } else {
        return res.send({status: false, data: null});
    }
});

app.post('/sign-up-user', function (req, res) {
    var attr = req.body;
    if (attr.hasOwnProperty('phone') && attr.hasOwnProperty('password')) {
        var options = {phone: attr.phone, password: attr.password};
        userDB.create_user(options, function (err, new_user) {
            if (err) {
                return res.send({status: false, data: err});
            } else {
                userDB.save_user(new_user, function (err, data) {
                    if (err) {
                        return res.send({status: false, data: err});
                    } else {
                        return res.send({status: true, data: {phone: new_user.phone, password: new_user.password}});
                    }
                });
            }
        })
    } else {
        return res.send({status: false, data: null});
    }
});

io.sockets.on('connection', function (socket) {
    socket.on('join_room', function (options) {
        userDB.find_user_by_token(options.room_id, function (err, user) {
            if (!err) {
                userDB.update_status({phone: user.phone, status: 1}, function (err, status) {
                    if (!err) {
                        socket.join(options.room_id);
                        socket.room = options.room_id;
                        var data = {status: true, data: 'readdy for connect'};
                        socket.to(options.room).emit('on_join_room', data);
                    } else {
                        var data = {status: false, data: 'server error'};
                        socket.to(options.room).emit('on_join_room', data);
                    }
                })
            }
        });
    });
    socket.on('send_sdp', function (options) {
        socket.to(options.buddy_room).emit('on_sdp_msg', options);
    });
    socket.on('disconnect', function () {
        if (typeof socket.room !== 'undefined') {
            socket.leave(socket.room);
            userDB.find_user_by_token(socket.room, function (err, user) {
                if (!err) {
                    userDB.update_status({phone: user.phone, status: 0}, function (err, status) {
                        console.log(err, status, 'updated user info');
                    })
                }else{
                    console.log('error');
                }
            });
        }else{
            console.log('unrecognized socket');
        }
    });
});
