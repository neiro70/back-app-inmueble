var mongoose = require('mongoose');
const Address = require('./Address');
const Phone = require('./Phone');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    is_active: Boolean,
    date_insert: Date,
    date_update: Date,
    occupation: String,
    rol: String,
    residence_id: {type: ObjectId, ref: "Residence"},
    phones:{ type: [Schema.ObjectId], ref: 'Phone' },
    address:{ type: [Schema.ObjectId], ref: 'Address' },
    password: String,
    token: String,

});


module.exports = mongoose.model('User', UserSchema);