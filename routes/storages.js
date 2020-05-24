/*
file name: storages.js
description: define RESTful API for Storage Model
*/
var express = require('express');
var router = express.Router();
var storageController = require('../controllers/storageController');

router.get('/', storageController.getAll);
router.get('/find/:code', storageController.getByCode);
router.post('/', storageController.insertStorage);
router.put('/update', storageController.updateStorage);
router.delete('/:code', storageController.deleteStorage);

module.exports = router;