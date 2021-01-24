var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID

var RecidenceSchema = new Schema({
    type: String,
    name: String,
    is_active: Boolean,
    dateInsert: Date,
    dateUpdate: Date,
});


module.exports = mongoose.model('Residence', RecidenceSchema);