var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', function(){
    console.log('Unsuccessful connection');
});
db.once('open', function () {
    console.log('Connection successful');
});

mongoose.connect('mongodb://localhost/test');

var kittenSchema = mongoose.Schema({
    name: String
});

var kitten = mongoose.model('kitten', kittenSchema)