/*
file name: Storage.js
description: define StorageSchema & exports as mongoose model
*/
var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Schema = mongoose.Schema;

var StorageSchema = new Schema({
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'WareHouse'}, // references to WareHouse Model
  stock: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}, // references to Item Model
  count: {type: Number, min: 0, required: true},
  remark: {type: String},
  ModifiedDate: {type: Date, default: Date.now()}
 }
);
StorageSchema.plugin(AutoIncrement, {inc_field: 'recordCode'}); // Use AutoIncrement number as id
//Export model
module.exports = mongoose.model('Storage', StorageSchema);