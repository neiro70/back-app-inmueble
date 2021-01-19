var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID

var TelSchema = new Schema({
    number: String,
    type: String,
    isActive: Boolean,
    dateInsert: Date,
});


module.exports = mongoose.model('Tel', TelSchema);