var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID

var RecidenceSchema = new Schema({
    type: String,
    name: String,
    isActive: Boolean,
    dateInsert: Date,
    dateUpdate: Date,
});


module.exports = mongoose.model('Recidence', RecidenceSchema);