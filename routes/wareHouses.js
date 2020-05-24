/*
file name: wareHouses.js
description: define RESTful API for WareHouse Model
*/
var express = require('express');
var router = express.Router();

var wareHouseController = require('../controllers/wareHouseController');

router.get('/', wareHouseController.getAll);
router.get('/names', wareHouseController.getNames);
router.get('/checkCode/:code', wareHouseController.checkCode);
router.get('/size', wareHouseController.getSize);
router.get('/find/:code', wareHouseController.getByCode);
router.post('/insert', wareHouseController.inesrtWareHouse);
router.put('/update', wareHouseController.updateInfo);
router.delete('/:code', wareHouseController.deleteWareHouse);

module.exports = router;