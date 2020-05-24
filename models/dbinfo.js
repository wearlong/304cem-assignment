/*
file name: dbinfo.js
description: define database name & connection path
*/
//const address = "127.0.0.1";
const dbname = "test";
const url = `mongodb+srv://chpeter868:00000000@cluster0-i6rrc.gcp.mongodb.net/${dbname}?retryWrites=true&w=majority`;

module.exports.url = url;