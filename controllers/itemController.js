/*
file name: itemControllers.js
description: Handle RESTful API for Item
*/
var itemModel = require('../models/Item');

// return: [array]
exports.getAll = function(req, res){
 itemModel.find({}, (err, result) => {
  console.log('Retriving all Items...');
  if(err){
   console.log('Get All Item Error');
   res.send("error");
   throw err;
  }
  res.send(result);
 })
};

// return {result: boolean, data: object, error: String}
exports.getByCode = function(req, res){
 let code = req.params.itemCode;
 itemModel.find({itemCode: code}, (err, result) => {
  if(err){
   console.log(`Finding Item (${code}) Error`);
   res.send({"result":false, "error" : "db"});
   throw err;
  }
  if(result.length > 0){
   console.log(`Item - ${code} found`);
   res.send({"result":true,"data":result[0]});
  } else {
   console.log(`Item - ${code} not found`);
   res.send({"result":false, "error" : "empty"});
  }
 });
};

// return {result: boolean, data: object, error: String}
exports.getNames = function(req, res){
 itemModel.find({}, {itemCode: 1, name: 1}, (err, result) => {
  if(err){
   console.log(`Retreive all item name Error`);
   res.send({"result":false, "error": "db"});
   throw err;
  }
   console.log(`Retreiving all item name`);
   res.send({"result":true, "data": result});
 })
}

// return {result: boolean, error: String}
exports.checkCode = function(req, res){
 let code = req.params.itemCode;
 itemModel.find({itemCode: code}, (err, result) => {
  if(err){
   console.log(`Check Code (${code}) Error`);
   res.send({"result":true, "error" : "db"});
   throw err;
  }
  res.send({"result": result.length > 0});
 });
}

// return {result: boolean, error: String}
exports.insertItem = function(req, res){
 //check access right
 if(req.session.auth){
  let item = new itemModel(req.body);
  item.save((err) => {
   if(err){
    console.log(`Insert Item ( ${item.name} ) Error`);
    res.send({"result": false, "error": "db"});
    throw err;
   }
   console.log(`Item Inserted : ${item.itemCode} - ${item.name}`);
   res.send({"result": true});
  });
 } else {
  console.log("Insert Item Error ( No Rights )");
  res.send({"result":false, "error": "auth"});
 }
}

// return {result: boolean, error: String}
exports.updateItem = function(req, res){
 if(req.session.auth){
  let item = req.body;
  let code = item.itemId;
  delete item.itemId;
  itemModel.updateOne({itemCode: code}, item, (err, result) => {
   if(err || result.updatedCount < 1){
    console.log(`Update Item - ${code} Error`);
    res.send({"result":false, "error":"db"});
    throw err;
   }
   console.log(`Item Updated : ${code}`);
   res.send({"result":true});
  });
 } else {
  console.log(`Update Item - ${req.body.itemCode} Error (No rights)`);
  res.send({"result":false,"error":"auth"});
 }
}

// return {result: boolean, error: String}
exports.deleteItem = function(req, res){
 //check access right
 if(req.session.auth){
  let code = req.params.itemCode;
  itemModel.deleteOne({itemCode: code}, (err, result)=>{
   if(err){
    console.log(`Delete Item Error ( ${code} )`);
    res.send({"result":false, "error":"db"});
    throw err;
   }
   console.log(`Delete Item ( ${code} )`);
   res.send({"result": result.deletedCount > 0});
  });
 } else {
  console.log(`Delete Item Error ( No rights )`);
  res.send({"result": false, "error": "auth"});
 }
}