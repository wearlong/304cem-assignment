/*
file name: userControllers.js
description: Handle RESTful API for User
*/
var userModel = require('../models/User');
var crypto = require('crypto');

// return: {result: boolean, error: String}
exports.login = function(req, res){
 let pwd = req.params.pwd;
 let username = req.params.username;

 pwd = md5(pwd); // encrypt and compare with the password in database
 userModel.find({username: username},(err, data)=>{
  if(err){
   console.log(`Find User (${username}) Error`);
   res.send({"result" : false, "error" : "db"});
   throw err;
  }
  if(data.length > 0){
   // User found
   if(data[0].password == pwd){
    req.session.auth = data[0].username;
    console.log(`User Login Succesfully: ${username}`);
    res.send({"result": true});
   } else {
    console.log(`User Login Error ( Wrong Password ) : ${username}`)
    res.send({"result":false, "error": "pwd"});
   }
  } else {
   // User not found
   console.log(`User Login Error ( User Not Found )`);
   res.send({"result":false, "error":"username"});
  }
 });
};

// return: {result: boolean}
exports.logout = function(req, res){
 if(req.session.auth){
  console.log(`User Logout Successfully: ${req.session.auth}`);
  req.session.auth = undefined;
  res.send({"result":true});
 } else {
  console.log(`User Logout Error`);
  res.send({"result":false});
 }
}

// return: {result: boolean, username: String, fullname: String}
exports.isLogin = function(req, res){
 if(req.session.auth){
  userModel.find({username: req.session.auth}, (err, data) => {
   if(err){
    console.log(`Check Login (${username}) Error`);
    res.send({"result" : false, "error" : "db"});
    throw err;
   }
   let user = new userModel(data[0]);
   res.send({
    "result" : true,
    "username" : user.username,
    "fullname" : user.fullName
   });
  });
 } else {
  res.send({"result":false});
 }
}

// return: {result: boolean, error: String}
exports.checkUserName = function(req, res){
 console.log(`Finding Username : ${req.params.username}`);
 userModel.find({username: req.params.username}, (err, data)=>{
  if(err){
   console.log(`Check Username Error`);
   res.send({"result" : true, "error" : "db"});
   throw err;
  }
  //console.log(data);
  res.send({"result" : data.length > 0});
 });
}

exports.register = function(req, res){
 // Initialize userModel with data
 var newUser = new userModel({
  username: req.body.username,
  password: md5(req.body.pwd),
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  dateOfBirth: req.body.dob
 });
 // Insert User
 newUser.save(function(err){
  if(err){
   console.log(`Registration Error! (${newUser.username})`);
   res.send({"result":false, "error" : "db"});
   throw err;
  }else{
   // added successfully
   req.session.auth = newUser.username;
   console.log(`Register successfully (${newUser.username})`);
   res.send({"result": true});
  }
 });
};

// return: {result: boolean, error: String}
exports.updateUser = function(req, res){
 // check access right
 if(req.session.auth != null){
  let username = req.body.username;
  // update
  userModel.updateOne({username: username},{
   dateOfBirth: req.body.dob,
   firstName: req.body.firstName,
   lastName: req.body.lastName,
   ModifiedDate: Date.now()
  }, function(err, result){
   if(err){
    console.log(`Update Error! (${username})`);
    res.send({"result":false, "error" : "db"});
    throw err;
   }
   if(result.updatedCount > 0){
    console.log(`Updated User: ${username}`);
   } else {
    console.log(`Update User Failed: ${username}`);
    res.send({"result" : false});
   }
  });
 } else {
  console.log(`Update User Error ( No Rights )`);
  res.send({"result": false, "error": "auth"});
 }
};

// return: {result: boolean, error: String}
exports.deleteUser = function(req, res){
 // check access right
 if(req.session.auth != null){
  if(req.params.username != null){
   let username = req.params.username;
   userModel.deleteOne({username: username}, (err, result) => {
    if(err){
     console.log(`Update Error! (${username})`);
     res.send({"result":false, "error" : "db"});
     throw err;
    }
    if(result.deletedCount > 0){
     console.log(`Deleted User: ${username}`);
     res.send({"result": true});
    } else {
     console.log(`Delete User Failed: ${username}`);
     res.send({"result": false});
    }
   });
  }
 } else {
  console.log(`Delete User Error ( No Rights )`);
  res.send({"result": false, "error": "auth"});
 }
};

function md5(str){
 var md5sum = crypto.createHash('md5');
 return md5sum.update(str).digest('hex');
}