var mongoose = require('mongoose');
const Address = require('./Address');
const Tel = require('./Tel');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    isActive: Boolean,
    dateInsert: Date,
    dateUpdate: Date,
    occupation: String,
    rol: String,
    recidencia_id: {type: ObjectId, ref: "Recidence"},
    tels:{ type: [Schema.ObjectId], ref: 'Tel' },
    address:{ type: [Schema.ObjectId], ref: 'Address' },
    password: String

});


module.exports = mongoose.model('User', UserSchema);