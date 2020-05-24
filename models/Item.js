/*
file name: Item.js
description: define ItemSchema & exports as mongoose model
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema(
 {
  name: {type: String, required: true},
  itemCode: {type: String, required: true, unique: true},
  height: {type: Number, min: 0, require: true},
  width: {type: Number, min: 0, require: true},
  weight: {type: Number, min: 0, required: true},
  category: {type: String, require: true},
  ModifiedDate: {type: Date, default: Date.now()}
 }
);

//Export model
module.exports = mongoose.model('Item', ItemSchema);