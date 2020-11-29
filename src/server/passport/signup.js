var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var encoding=require('../util.js');
var ENVIRONMENT = require('../config-module.js').config();
const log4js = require("log4js");
log4js.configure({
  appenders: { passport: { type: "file", filename: "passport.log" } },
  categories: { default: { appenders: ["passport"], level: "error" } }
});
 
const logger = log4js.getLogger("api");

module.exports = function(passport){
    logger.info("signupjs::exporting signup passport module");
	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            findOrCreateUser = function(){
                logger.info("signupjs::findOrCreateUser");
                // find a user in Mongo with provided username
                User.findOne({ 'email' :  username }, (err, user) => {
                    // In case of any error, return using the done method
                    if (err){
                        logger.error('Error in SignUp: ', err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        logger.info('User already exists with email: ', username);
                        return done(null, false, req.flash('message','User'+ username +' Already Exists!'));
                    }else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.password = createHash(password);
                        newUser.email = username;//req.body.email;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.signupDate = req.body.signupDate;
                        
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                logger.error('Error in Saving user: ', err);  
                                throw err;  
                            }
                            logger.info('User Registration successful');  
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        if(password == null) return null;
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}