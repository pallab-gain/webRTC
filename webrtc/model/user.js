/**
 * Created by xerxes on 3/14/14.
 */

//var uuid = require('node-uuid');
var mongo = require('mongoose');

var db = mongo.connection;
db.on('error', function () {
    console.log('Unsuccessful connection');
});
db.once('open', function () {
    console.log('Connection successful');
});
mongo.connect('mongodb://localhost/test');
var userSchema = mongo.Schema({
    name: String,
    phone: String
});
var User = mongo.model('User', userSchema);

var userController = function () {
    return {
        add_user: function (options) {
            var name = options.name;
            var phone = options.phone;
            return  new User({name: name, phone: phone});
        },
        save_user: function (cur_user, callback) {
            cur_user.save(function (err, cur_user, number_affect) {
                callback(err, cur_user, number_affect);
            });
        },
        find_user: function (phone, callback) {
            User.find({phone: phone}).exec(function (err, users) {
                callback(err, users);
            })
        }
    };
};
module.exports = userController;