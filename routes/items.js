/*
file name: items.js
description: define RESTful API for Item Model
*/
var express = require('express');
var router = express.Router();

var itemController = require('../controllers/itemController');
router.get('/', itemController.getAll);
router.get('/names', itemController.getNames);
router.get('/find/:itemCode', itemController.getByCode);
router.get('/checkCode/:itemCode', itemController.checkCode);
router.post('/insert', itemController.insertItem);
router.put('/update', itemController.updateItem);
router.delete('/:itemCode', itemController.deleteItem);
module.exports = router;