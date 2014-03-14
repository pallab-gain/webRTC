var User = require('./webrtc/model/user');

var userDB = new User();

var user1 = userDB.add_user({name: 'Pallab1', phone: '01727013230'});
var user2 = userDB.add_user({name: 'Pallab2', phone: '01727013230'});
var user3 = userDB.add_user({name: 'Pallab3', phone: '01727013230'});

userDB.save_user(user1, function (err, user, number_affect) {
    //console.log(err, user, number_affect);
});
userDB.save_user(user2, function (err, user, number_affect) {
    //console.log(err, user, number_affect);
});
userDB.save_user(user3, function (err, user, number_affect) {
    //console.log(err, user, number_affect);
});

userDB.find_user('01727013230', function (err, users) {
    console.log(err, users);
});