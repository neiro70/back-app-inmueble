const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const LOG4J = require('../../log4j-config-module.js').config();
const log4js = require("log4js");
log4js.configure(LOG4J.api.common);

const logger = log4js.getLogger("api");

// Set the data
// Set a secret to generate JWT
var _secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';

module.exports = function(req, res, done) {
    const resToken = _generateJWTToken();
    if(resToken) return done(null, resToken);
    return done('Failure', null);
}

function _base64url(source) {
    // create a buffer
    //const buff = Buffer.from(source, 'utf-8');
    let buff = CryptoJS.enc.Utf8.parse(source);

    // decode buffer as Base64
    let encodedBase64 = CryptoJS.enc.Base64.stringify(buff);
    //let base64 = buff.toString('base64');
    encodedBase64 = encodedBase64.replace(/=+$/, '');
    encodedBase64 = encodedBase64.replace(/\+/g, '-');
    encodedBase64 = encodedBase64.replace(/\//g, '_');

    return encodedBase64;
}

function _generateJWTToken() {
    // Define token header
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    // Calculate the issued at and expiration dates
    const date = new Date();
    const iat = Math.floor(date.getTime() / 1000);
    const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

    // Define token payload
    const payload = {
        iat: iat,
        iss: 'Priron',
        exp: exp
    };

    // Stringify and encode the header
    //const buffHeader = Buffer.from(JSON.stringify(header), 'utf-8');
    //const encodedHeader = _base64url(buffHeader);
    const buffHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = CryptoJS.enc.Base64.stringify(buffHeader);    

    // Stringify and encode the payload
    //const buffPayload = Buffer.from(JSON.stringify(payload), 'utf-8');
    //const encodedPayload = _base64url(buffPayload);
    const buffPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    const encodedPayload = CryptoJS.enc.Base64.stringify(buffPayload);

    const buffDecodeHeader = Buffer.from(encodedPayload, 'base64');
    logger.info("buffDecodeHeader = ", buffDecodeHeader);
    logger.info("buffPayload = ", buffPayload);

    // Sign the encoded header and data
    let signature = crypto.createHmac('sha256', _secret)
                   .update(encodedHeader + '.' + encodedPayload)
                   .digest('hex');
    signature = _base64url(signature);

    logger.info("encodedHeader = ", encodedHeader);
    logger.info("encodedPayload = ", encodedPayload);
    logger.info("signature with digest = ", signature);

    // Build and return the token
    return encodedHeader + '.' + encodedPayload + '.' + signature;
}