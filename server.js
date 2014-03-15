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
app.post('/check-valid-user', function (req, res) {
    var attr = req.body;
    if (attr.hasOwnProperty('phone') && attr.hasOwnProperty('password')) {
        var options = {phone: attr.phone, password: attr.password};
        userDB.is_valid_user(options, function (err, data) {
            if (err) {
                return res.send({status: false, data: err});
            } else {
                return res.send({status: true, data: {token: data._id, phone: data.phone}});
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

