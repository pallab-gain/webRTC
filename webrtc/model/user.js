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
    phone: String,
    password: String,
    status: Number
});
var User = mongo.model('User', userSchema);

var userController = function () {
    create_user = function (options, callback) {
        var phone = options.phone;
        var password = options.password;
        var self = this;
        self.is_exist(phone, function (err, exist) {
            if (err) {
                callback('server error', false);
            } else {
                if (exist) {
                    callback('phone number already exist', null);
                } else {
                    callback(null, new User({password: password, phone: phone, status: 0}));
                }
            }
        });
    };
    save_user = function (cur_user, callback) {
        cur_user.save(function (err, cur_user, number_affect) {
            callback(err, cur_user, number_affect);
        });
    };
    find_user = function (phone, callback) {
        User.findOne({phone: phone}).exec(function (err, user) {
            if (err) {
                callback('server error', null);
            } else if (!user) {
                callback('could not find user', null);
            }
            else {
                callback(null, user);
            }
        })
    };
    is_exist = function (phone, callback) {
        User.findOne({phone: phone}).exec(function (err, user) {
            if (err) {
                callback('server error', null);
            } else {
                callback(null, user ? true : false);
            }
        });
    };
    is_valid_user = function (options, callback) {
        var self = this;
        self.find_user(options.phone, function (err, user) {
            if (err) {
                callback(err, null);
            } else {
                if (options.password === user.password) {
                    callback(null, user);
                } else {
                    callback('invalid user', null);
                }
            }
        })
    }
    return {
        create_user: create_user,
        save_user: save_user,
        find_user: find_user,
        is_exist: is_exist,
        is_valid_user: is_valid_user
    }

};
module.exports = userController;