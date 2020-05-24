/*
file name: users.js
description: define RESTful API for User Model
*/
var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');
router.get('/login/:username/:pwd', userController.login);
router.get('/checkUser/:username', userController.checkUserName);
router.get('/isLogin', userController.isLogin);
router.get('/logout', userController.logout);
router.post('/register', userController.register);
router.put('/', userController.updateUser);
router.delete('/:username', userController.deleteUser);
module.exports = router;