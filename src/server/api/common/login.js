var express = require('express');
const jwt = require("jsonwebtoken");
const createUser = require('../../db/insert/user/createUser');
const jwtSign = require('../../utils/auth/jwtSign');
const util = require('../../util.js');
const LOG4J = require('../../log4j-config-module.js').config();
const log4js = require("log4js");
log4js.configure(LOG4J.api.common);
 
const logger = log4js.getLogger("api");
var ENVIRONMENT = require('../../config-module.js').config();
var encoding = require('../../util.js');

module.exports = function (passport, req, res, next, action) {
	console.log(req.body)
	console.log(action)
	if (action == 'token') {
		jwtSign(req, res,
			(err, token) => {
				if (err) {
					logger.debug("token::err = " + JSON.stringify(err));
					return res.status(401).json({ err: err, status: -1 });
				} else {
					return res.status(200).json({ access_token: token });
				}
			});
	}

	if (action == 'signup') {
		passport.authenticate('signup', function (err, user, info) {
			if (err) { 
				logger.error("authenticate signup error = " + JSON.stringify(err));
				return next(err); 
			}
			if (!user) { 
				res.status(403).json({ error: "User already exists" }); 
			}
			else {
				jwtSign(req, res,
					(err, token) => {
						if(token) {
							return res.status(200).json({
								access_token: token,
								_id: user._id,
								name: user.name,
								lastname: user.lastname
							});
						} else {
							logger.error("Sign up::JWT error = %s ", JSON.stringify(err));
							return res.status(400).json({
								error: "JWT error " + JSON.stringify(err)
							})
						}
					})
			}
		})(req, res, next);
	}
	else if (action == 'login') {
		console.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>login");
		passport.authenticate('login', function (err, user, info) {
			console.log(err)
			console.log(user)
			console.log(info)
			if (err) {
				logger.error("Login error, %s", JSON.stringify(err));
				return next(err);
			}
			if (!user) {
				return res.status(403).json({ error: "Invalid username or password" });
			} else {
				jwtSign(req, res,
					(err, token) => {
						if (err) {
							logger.error("Login token error, %s", JSON.stringify(err));
							return res.status(401).json({ err: err, status: -1 });
						} else {
							return res.status(200).json({
								access_token: token,
								_id: user._id,
								name: user.name,
								lastname: user.lastname
							});
						}
					}
				)
			}
		})(req, res, next);
	}
}