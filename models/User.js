/*
file name: Users.js
description: define UserSchema & exports as mongoose model
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
 {
  username: {type: String, required: true, index: { unique: true}},
  password: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  dateOfBirth: {type: Date},
  ModifiedDate: {type: Date, default: Date.now()}
 }
);

UserSchema
.virtual('fullName')
.get(function(){
 return this.firstName + " " + this.lastName;
});

//Export model
module.exports = mongoose.model('User', UserSchema);