/*
file name: wareHouseControllers.js
description: Handle RESTful API for WareHouse
*/
var wareHouseModel = require('../models/WareHouse');

// return: {result: boolean, data: Array, error: String}
exports.getAll = function(req, res){
 wareHouseModel.find({}, (err, result)=>{
  if(err){
   console.log("Retrieve WareHouse Error");
   res.send({"result":true,"error":"db"});
   throw err;
  }
  console.log("Retrieving all wareHouses...");
  res.send({"result":true, "data": result});
 });
}

// return: {result: boolean, data: object, error: String}
exports.getByCode = function(req, res){
 let code = req.params.code;
 wareHouseModel.find({code: code}, (err, result) => {
  if(err){
   console.log(`Finding WareHouse (${code}) Error`);
   res.send({"result": false, "error": "db"});
  }
  if(result.length > 0){
   console.log(`WareHouse - ${code} found`);
   res.send({"result": true, "data": result[0]});
  } else {
   console.log(`WareHouse - ${code} not found`);
   res.send({"result": false, "error": "empty"});
  }
 });
}

// return: {result: boolean, data: Array, error: String}
exports.getNames = function(req, res){
 wareHouseModel.find({}, {code: 1, name: 1}, (err, result) => {
  if(err){
   console.log(`Retreive all warehouse name Error`);
   res.send({"result":false, "error": "db"});
   throw err;
  }
  console.log(`Retreiving all warehose name`);
  res.send({"result":true, "data": result});
 });
}

// return: {result: boolean,error: String}
exports.checkCode = function(req, res){
 let code = req.params.code;
 wareHouseModel.find({code: code}, (err, result) => {
  if(err){
   console.log(`WareHouse code checking error`);
   res.send({"result":true, "error": "db"});
   throw err;
  }
  if(result.length < 1){
   res.send({"result" : false});
  } else {
   res.send({"result":true});
  }
 });
}

// return: {result: boolean,error: String}
exports.inesrtWareHouse = function(req, res){
 if(req.session.auth){
  // initialize new wareHouseModel with data
  let wareHouse = new wareHouseModel({
   code: req.body.code,
   name: req.body.name,
   address: req.body.address,
   size: req.body.size,
   description: req.body.description,
   Storages: []
  });
  wareHouse.save((err)=>{
   if(err){
    console.log(`Inserting WareHouse (${wareHouse.code}) Error`);
    res.send({"result":false,"error":"db"});
    throw err;
   }
   console.log(`WareHouse - ${wareHouse.code} inserted successfully`);
   res.send({"result":true});
  });
 } else {
  console.log(`Inserting WareHouse Error (No rights)`);
  res.send({"result":false, "error":"auth"});
 }
}

// return: {result: boolean,error: String}
exports.updateInfo = function(req, res){
 if(req.session.auth){
  let code = req.body.code;
  delete req.body.code; // prevent collision
  wareHouseModel.updateMany({code: code}, req.body, (err, result) => {
   if(err || result.updatedCount < 1){
    console.log(`Update WareHouse - ${code} Error`);
    res.send({"result": false, "error": "db"});
   }
   console.log(`WareHouse - ${code} has been updated successfully`);
   res.send({"result": true});
  });
 } else {
  console.log(`Update WareHouse - ${req.body.code} Error (No rights)`);
  res.send({"result": false, "error": "auth"});
 }
}

// return: {result: boolean,error: String}
exports.deleteWareHouse = function(req, res){
 if(req.session.auth){
  let code = req.params.code;

  let wareHouse = wareHouseModel.findOne({code: code});

  wareHouseModel.deleteMany({code: code}, (err, result)=>{
   if(err || result.deletedCount < 1){
    console.log(`Deleting WareHouse - ${code} Error`);
    res.send({"result":false, "error":"db"});
    throw err;
   }
   console.log(`WareHouse - ${code} has been deleted successfully`);
   res.send({"result": true});
  });
 } else {
  console.log(`deleteing WareHouse - ${req.body.code} (No rights)`);
  res.send({"result":false, "error": "auth"});
 }
}

// return: Object
exports.getSize = function(req, res){
 res.send(wareHouseModel.cprops.size);
}