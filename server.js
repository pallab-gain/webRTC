var User = require('./webrtc/model/user');
var userDB = new User();

var PORT = 9090;
var express = require('express'), app = express();
var server = app.listen(PORT);
var io = require('socket.io').listen(server); // this tells socket io to user express server

app.configure(function () {
    app.use('/css', express.static(__dirname + '/webrtc/view/css'));
    app.use('/js', express.static(__dirname + '/webrtc/view/js'));
    app.use('/fonts', express.static(__dirname + '/webrtc/view/fonts'));
    app.use('/html', express.static(__dirname + '/webrtc/view/html'));

    app.set('html', __dirname + '/webrtc/view/html');
});

app.get('/', function (req, res) {
    res.sendfile(app.get('html') + '/index.html');
})

