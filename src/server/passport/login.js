var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const log4js = require("log4js");
log4js.configure({
  appenders: { passport: { type: "file", filename: "passport.log" } },
  categories: { default: { appenders: ["passport"], level: "error" } }
});
 
const logger = log4js.getLogger("api");

module.exports = function(passport){
    try {
        passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                let filter = {
                    username: username
                };
                if(username.indexOf("@") > -1) filter = { email: username };
                // check in mongo if a user with username exists or not
                User.findOne(filter,
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            logger.info('User Not Found with username ', username);
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }
                        
                        //In case of user sign in with google
                        if(!user.password) {
                            logger.info('User was signed up with google ', username);
                            return done(null, user, req.flash('message', 'User Not found. did you signed up with google?'));
                        }

                        // User exists but wrong password, log the error
                        if (!isValidPassword(user, password)) {
                            logger.error("Invalid Password, usernamer = ", user);
                            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    }
                );

            })
        );
    } catch(error) {
        logger.error("LOGIN ERROR = " + JSON.stringify(error));
    }


    var isValidPassword = function(user, password){
        try {
            return bCrypt.compareSync(password, user.password);
        } catch(error) {
            logger.error("isValidPassword exception " + JSON.stringify(error));
        }
    }

}
