var mongoose = require('mongoose');
const User = require("../models/User");
const Phone = require('../models/Phone');
const Address = require('../models/Address');
const Residence = require('../models/Residence');
var ObjectID = require('mongodb').ObjectID
//var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');


/** SERVICE REST */
var userController = {};

/** http://localhost:3000/users/list */
userController.list = function(req, res){
    User.find({}).exec(function(err, users){
        if( err ){ console.log('Error: ', err); return; }
        return res.status(200).json( {users: users} );
    });
    
};

/** http://localhost:3000/users/createUser */
userController.createUser = async function(req, res){
    let user = new User()  ;
    let phone = new Phone();
    let address = new Address();
    let residence = new Residence();

    user.name = req.body.name;
    user.lastname=req.body.lastname;
    user.email=req.body.email;
    user.rol=req.body.rol;
    

    try{
         User.findOne({email:user.email,is_active:true}).exec(function(err, userFind){
            if( err ){ throw err }
            if(userFind){
                res.status(200).json({code:"002",msg:"User "+user.email+ " exist!"});
            }else{
                if(req.body.phones.length > 0){
                    let arr = req.body.phones;
                    for(var i = 0; i < arr.length; i++)
                    {
                        var number = arr[i].number;
                        var type = arr[i].type;
                        phone.number = number;
                        phone.type = type;
                        phone.date_insert = new Date();
                        phone.is_active = true;
                        phone.save();
                        user.phones.push(phone);
                       
                    }
                }
                
                if(req.body.address.length > 0){
            
                    let arr =req.body.address;
                    for(var i = 0; i < arr.length; i++)
                    {
                        address.calle = arr[i].calle;
                        address.numExt = arr[i].numExt;
                        address.numInt = arr[i].numInt;
                        address.cp = arr[i].cp;
                        address.city = arr[i].city;
                        address.town = arr[i].town;
                        address.type = arr[i].type;
                        address.date_insert = new Date();
                        address.is_active = true;
                        address.save();
                        user.address.push(address);
                    }
                
                }    
                //busca  recidencie para insertar
                 Residence.findOne({name:req.body.residence.name},  function(err, result) {
                    if (err) throw err;
                    if(result == null){
                        residence.name = req.body.residence.name;
                        residence.date_insert = new Date();
                        residence.is_active = true;
                        residence.save();
    
                    }else{
                        residence=result;
                    }
                
                    //inser user
                    user.date_insert = new Date();
                    user.is_active = true;
                    user.residence_id = residence;
                    user.password = createHash("password"); //password by dafault
                
                    user.save(function(err){
                        if( err){ throw err }
                        
                        console.log("Successfully created user :)");
                        return res.status(200).json({code:"001",msg:"Successfully created"});
                        
                    });
                
                }); 


               


               
            }            
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({code:"500",msg:"Error general"});1
    }

};

/** http://localhost:3000/users/findByEmail/:email */
userController.findByEmail = async function(req, res){
    await User.findOne({email:req.params.email,isActive:true},
        {   name: 1,
            lastname:1,
            tels:1,
            rol:1,
            address:1,
            email:1,
            recidencia_id:1}
        ).exec(function(err, user){
        if( err ){ console.log('Error: ', err); return; }
        if(user){
            let tmp="";
            let result =   Recidence.findById(user.recidencia_id).exec(function(err, doc){                
                let myObj = new Object();
                myObj.recidence = doc.name;
                myObj.name = user.name;
                myObj.lastname = user.lastname;
                myObj.email = user.email;
                myObj.occupation = user.occupation;
                myObj.rol = user.rol;
                myObj.isActive = user.isActive;
                myObj.dateInsert = user.dateInsert;
                myObj.tels = user.tels;
                myObj.address = user.address;              
                myObj.tels = user.tels;
                //console.info(myObj);
                return res.status(200).json(myObj);
                
            });
        }else{
            res.status(200).json({code:"002",msg:"usuario no encontrado!"}); 
        }        
    });
};

/** http://localhost:3000/users/updatePassword */
userController.updatePassword = async function(req, res){
    //console.info("req.body:",req.body);
    var code = req.body.password;
    

    try{

        const filter = { _id: req.body.id};
        const update = { password: createHash(code) ,dateUpdate:new Date()}

        User.findOneAndUpdate(filter,update).exec(function(err, user){
            if(err){ throw err }
            if(user){
                console.info("Se actualizo password");
                return res.status(200).json({code:"001",msg:"Successfully updated user"});
            }else{
                res.status(200).json({code:"002",msg:"usuario no encontrado!"});  
            }

        });

    }catch(error){
        console.error(error);
        return res.status(500).json({code:"500",msg:"Error general"});
    }
};

    // Generates hash using bCrypt
    var createHash = function(password){
        if(password == null) return null;
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }


module.exports = userController;