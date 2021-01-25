var User = require('../../../models/User');
const LOG4J = require('../../../log4j-config-module.js').config();
const log4js = require("log4js");
log4js.configure(LOG4J.api.common);
 
const logger = log4js.getLogger("api");

module.exports = function(req, res, done) {
    var newUser = new User();

    // set the user's local credentials
    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.signupDate = req.body.signupDate;
    
    // save the user
    newUser.save(function(err) {
        if (err){
            logger.error('Error in Saving user: ', err);  
            done(err, null);
        }
        logger.info('User Registration succesful');    
        return done(null, newUser);
    });
}