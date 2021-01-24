var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID

var AddressSchema = new Schema({
    calle: String,
    numExt: String,
    numInt: String,
    cp: String,
    city: String,
    town: String,
    type: String,
    date_insert: Date,
    is_active: Boolean,
});


module.exports = mongoose.model('Address', AddressSchema);