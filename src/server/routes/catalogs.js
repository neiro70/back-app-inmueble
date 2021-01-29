var express = require('express');
var router = express.Router();

var catalog = require('../controllers/CatalogosController.js');
router.get('/listResidences', catalog.listResidences);
router.get('/ListRoles', catalog.listRoles);

module.exports = router;
