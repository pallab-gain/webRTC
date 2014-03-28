/**
 * Created by xerxes on 3/27/14.
 */
exports.login = function (req, res) {
    res.sendfile('views/login.html');
};

exports.home = function (req, res) {
    res.sendfile('views/home.html');
};
exports.me = function (req, res) {
    res.send(req.user);
};

exports.addbuddy = function (req, res) {

};