var mongoose = require('mongoose');
const Residence = require('../models/Residence');
const Role = require('../models/Role');
var ObjectID = require('mongodb').ObjectID
//var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');


/** SERVICE REST */
var catalogController = {};

/** http://localhost:3000/catalog/listResidences */
catalogController.listResidences = function(req, res){
    Residence.find({
        "is_active": true
    },{
       "_id": 1,
       "name": 1
    }
    ).exec(function(err, residences){
        if( err ){ console.log('Error: ', err); return; }
        return res.status(200).json( {residences: residences} );
    });
    
};
/** http://localhost:3000/catalog/listRoles */
catalogController.listRoles = function(req, res){
    Role.find({
        "is_active": true
    },{
       "_id": 1,
       "name": 1,
       "key":1
    }
    ).exec(function(err, roles){
        if( err ){ console.log('Error: ', err); return; }
        return res.status(200).json( {roles: roles} );
    });
    
};



module.exports = catalogController;