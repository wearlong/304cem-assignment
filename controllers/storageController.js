/*
file name: storageControllers.js
description: Handle RESTful API for Item
*/
var itemModel = require('../models/Item');
var wareHouseModel = require('../models/WareHouse');
var storageModel = require('../models/Storage');

// return: {result: boolean, data: Array, error: String}
exports.getAll = function(req, res){
 storageModel.find({})
 .populate('location')
 .populate('stock')
 .exec((err, result)=>{
  if(err){
   console.log(`Retreive all storage Error`);
   res.send({"result":false, "error":"db"});
   throw err;
  }
  console.log(`Retreiving all storage`);
  res.send({"result":true, "data": result});
 });
}

// return: {result: boolean, data: object, error: String}
exports.getByCode = function(req, res){
 let code = req.params.code;
 storageModel.find({"recordCode":code})
 .populate('location')
 .populate('stock')
 .exec((err, result)=>{
  if(err){
   console.log(`Find Storage (${code}) error`);
   res.send({"result":false, "error": "db"});
   throw err;
  }
  if(result.length > 0){
   console.log(`Storage (${code}) is found`);
   res.send({"result":true, "data": result[0]});
  } else {
   console.log(`Storage (${code}) not found`);
   res.send({"result":false, "error": "empty"});
  }
 })
}

// return {result: boolean, error: String}
exports.insertStorage = function(req, res){
 if(req.session.auth){
  let model = {
   count: req.body.count,
   remark: req.body.remark
  }
  // find item
  itemModel.findOne({itemCode: req.body.stock}).exec((err, result) => {
   if(err){
    console.log(`Insert Storage Error`);
    res.send({"result":false, "error": "db"});
    throw err;
   }
   model.stock = result._id;
   // find wareHouse
   wareHouseModel.findOne({code: req.body.location}).exec((err, result) => {
    if(err){
     console.log(`Insert Storage Error`);
     res.send({"result":false, "error": "db"});
     throw err;
    }
    model.location = result._id;
    let storage = new storageModel(model);
    // Insert
    storage.save((err)=>{
     if(err){
      console.log(`Insert Storage Error`);
      res.send({"result":false, "error": "db"});
      throw err;
     }
     console.log(`Storage inserted successfully`);
     res.send({"result": true});
    });
   });
  })
 } else {
  console.log(`Insert Storage Error (No Rights)`);
  res.send({"result":false, "error": "auth"});
 }
}

// return {result: boolean, error: String}
exports.updateStorage = function(req, res){
 if(req.session.auth){
  // update value
  let model = {
   count: req.body.count,
   remark: req.body.remark
  }
  // find item
  itemModel.findOne({itemCode: req.body.stock}).exec((err, result) => {
   if(err){
    console.log(`Update Storage Error`);
    res.send({"result":false, "error": "db"});
    throw err;
   }
   model.stock = result._id;
   // find wareHouse
   wareHouseModel.findOne({code: req.body.location}).exec((err, result) => {
    if(err){
     console.log(`Update Storage Error`);
     res.send({"result":false, "error": "db"});
     throw err;
    }
    model.location = result._id;
    // update
    storageModel.updateOne({recordCode: req.body.recordCode}, model).exec((err, result) => {
     if(err || result.updatedCount < 1){
      console.log(`Update Storage Error`);
      res.send({"result":false, "error": "db"});
      throw err;
     }
     console.log(`Storage (${req.body.recordCode}) has been updated successfully`);
     res.send({"result": true});
    });
   });
  });
 } else {
  console.log(`Update Storage Error (No Rights)`);
  res.send({"result":false, "error": "auth"});
 }
}

// return {result: boolean, error: String}
exports.deleteStorage = function(req, res){
 if(req.session.auth){
  let code = req.params.code;
  storageModel.deleteOne({recordCode: code}).exec((err, result) => {
   if(err || result.deletedCount < 1){
    console.log(`Delete Storage (${code}) Error`);
    res.send({"result":false, "error": "db"});
    throw err;
   }
   console.log(`Storage (${code}) has been deleted successfully`);
     res.send({"result": true});
  });
 } else {
  console.log(`Delete Storage Error (No Rights)`);
  res.send({"result":false, "error": "auth"});
 }
}