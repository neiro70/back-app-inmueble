var express = require('express');
var router = express.Router();

const loginAPI = require('../api/common/login');
const userApiRead = require('../api/user/read/userApiRead');

module.exports = function (passport) {

	/**
   * login api
   */

	/* Handle JWT Token */
	router.get('/token', function (req, res, next) {
		loginAPI(passport, req, res, next, 'token');
	});

	/* Handle Signup POST */
	router.post('/signup', function (req, res, next) {
		loginAPI(passport, req, res, next, 'signup');
	});

	/* Handle social media Signup POST */
	router.post('/signupsm', function (req, res, next) {
		loginAPI(null, req, res, next, 'signupsm');
	})

	/* Handle Login POST */
	router.post('/login', function (req, res, next) {
		loginAPI(passport, req, res, next, 'login');
	});

	/**
   * user api read
   */

	/* Handle Get User-Profile */
	router.get('/user-profile/:id', function (req, res) {
		userApiRead(req, res, 'user-profile');
	});

	/* Handle get user basic information */
	router.post('/getBasicInfo', function (req, res) {
		userApiRead(req, res, 'getBasicInfo');
	});

	/* Handle find user by email */
	router.post('/findUserByEmail', function (req, res) {
		userApiRead(req, res, 'findUserByEmail');
	})

	/* Handle reset password */
	router.post('/resetPassword', function (req, res) {
		userApiUpdate(req, res, 'resetPassword');
	});

	return router;
}
