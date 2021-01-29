var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID

var RoleSchema = new Schema({
    name: String,
    key: String,
    is_active: Boolean,
});


module.exports = mongoose.model('Role', RoleSchema);