/**
 * Created by xerxes on 3/27/14.
 */
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'webRTC',
    user: 'root',
    password: ''
})
con.connect(function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log('successfully connected to mysql server');
    }
});

var userController = function () {
    return {
        is_valid: function (username, password, callback) {
            var sql = " SELECT id as id FROM ?? WHERE ?? like ? AND ?? = ? "
            var val = ['users', 'username', username, 'password', password]
            sql = mysql.format(sql, val);
            con.query(sql, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else if (typeof result[0] === 'undefined') {
                    return callback(null, null);
                } else {
                    return callback(null, { id: result[0]['id'] });
                }
            });
        },
        find_by_id: function (id, callback) {
            var sql = " SELECT count(*) as exist FROM ?? WHERE ?? = ? "
            var val = ['users', 'id', id]
            sql = mysql.format(sql, val);
            con.query(sql, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else if (!result[0]['exist']) {
                    return callback(null, false);
                } else {
                    return callback(null, {'id': id});
                }
            });
        },
        get_people: function (attr, attr_val, callback) {
            var sql = " SELECT * FROM ?? WHERE ?? = ? "
            var val = ['users', attr, attr_val]
            sql = mysql.format(sql, val);
            con.query(sql, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else if (typeof result[0] == 'undefined') {
                    return callback('no user found', null);
                } else {
                    return callback(null, result[0]);
                }
            });
        },
        already_buddy: function (myid, buddyid, callback) {
            var sql = "select count(*) as exist from ?? where ?? = ? and ?? = ?"
            var val = ['buddy', 'me', myid, 'buddy_id', buddyid]
            sql = mysql.format(sql, val);
            con.query(sql, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else {
                    var already_friend = result[0]['exist'];
                    return callback(null, {'already_buddy': already_friend ? true : false})
                }
            })

        },
        make_buddy: function (myid, buddyid, callback) {
            var sql = "INSERT INTO ??(??, ??) VALUES (?,?)"
            var val = ['buddy', 'me', 'buddy_id', myid, buddyid]
            sql = mysql.format(sql, val);

            con.query(sql, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, {status: true, msg: 'successfully added to buddy list'});
                }
            })
        },
        create_user: function (username, password, phone, callback) {
            var sql = "insert into users(??,??,??) values(?,?,?)";
            var val = ['username', 'password', 'phone', username, password, phone];
            sql = mysql.format(sql, val);
            con.query(sql, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, result);
                }
            })
        },
        add_buddy: function (myid, buddy_phone, callback) {
            var self = this;
            self.get_people('phone', buddy_phone, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    self.already_buddy(myid, data['id'], function (err, _data) {
                        if (_data['already_buddy'] == true) {
                            return callback('already buddy', null);
                        } else {
                            self.make_buddy(myid, data['id'], function (err, __data) {
                                if (err) {
                                    return  callback(err, null);
                                } else {
                                    return callback(null, __data);
                                }
                            });
                        }

                    })
                }
            })
        },
        update_status: function (id, status_type, callback) {
            var sql = "UPDATE ?? SET ??=? WHERE ?? = ?";
            var val = ['users', 'status', status_type, 'id', id];
            sql = mysql.format(sql, val);
            con.query(sql, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, {status: true, data: data});
                }
            })
        },
        get_online_buddy: function (id, status_type, callback) {
            var sql = "SELECT * FROM users inner join buddy on users.id = buddy.buddy_id \ " +
                "where users.status = ? and buddy.me = ?";
            var val = [status_type, id]
            sql = mysql.format(sql, val);
            con.query(sql, function (err, data) {
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, data);
                }
            })
        }

    }
}
module.exports = userController;