var express = require('express');
var router = express.Router();

var user = require('../controllers/UserController.js');
router.get('/list', user.list);
router.post('/createUser', user.createUser);
router.get('/findByEmail/:email',user.findByEmail);
router.post('/updatePassword',user.updatePassword);
module.exports = router;
