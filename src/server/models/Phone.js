var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID

var PhoneSchema = new Schema({
    number: String,
    type: String,
    is_active: Boolean,
    date_insert: Date,
});


module.exports = mongoose.model('Phone', PhoneSchema);