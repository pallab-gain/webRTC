/**
 * Created by xerxes on 3/27/14.
 */
var Bookshelf = require('bookshelf');

var MySql = Bookshelf.initialize({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'webRTC',
        charset: 'utf8'
    }
});


var User = function () {


}