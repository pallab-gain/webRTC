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
        }
    }
}
module.exports = userController;