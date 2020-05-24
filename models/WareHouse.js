/*
file name: WareHouse.js
description: define WareHouseSchema & exports as mongoose model
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// initialize variables
const size = {
 'S' : 'Small',
 'M' : 'Medium',
 'L' : 'Large' 
};

var WareHouseSchema = new Schema(
 {
  code: {type:String, require:true, index: {unique: true}},
  name: {type: String, required: true},
  address: {type: String, require: true},
  size: {type: String, maxlength: 1, enum: Object.keys(size)},
  description: {type: String},
  Storages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
  ModifiedDate: {type: Date, default: Date.now()}
 }
);

WareHouseSchema
.virtual('Scale')
.get(function(){
 return size[this.size];
});

WareHouseSchema
.virtual('FullAddress')
.get(function(){
 return `${this.name}, ${this.address}`; 
});

//Export model
module.exports = mongoose.model('WareHouse', WareHouseSchema);

module.exports.cprops = {
 size
};