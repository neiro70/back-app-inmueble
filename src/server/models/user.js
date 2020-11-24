var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	gender: String,
	profile_picture_url: String,
	token: String,
	signupDate: Date,
	residenceCountry: String,
	residenceCity: String,
	isAdmin: Boolean,
	birthday: Date,
	hash: String,
	salt: String
});
