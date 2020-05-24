var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var morgan = require('morgan');

// initialize variables
const port = 3000;
const dburl = require('./models/dbinfo').url; // db connection path
const sessionKey = { // session settings
 name: 'skey',
 secret: '304cem',
 resave: false,
 saveUninitialized: false,
 cookie:{ secure: false, maxAge: 1000 * 60 * 15} // 15 minutes
};

// middle ware 
app.use(morgan('tiny')); // show restful api action in console
app.use(bodyParser.urlencoded({ extended: false })); // read form post
app.use(bodyParser.json());
app.use(session(sessionKey)); // use session
// middle ware

// set static path
app.use(express.static(__dirname + '/www'));

// db setup
mongoose.connect(dburl, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// set routing
// 4 modules --> Users, WareHouses, Items, Log (optional)
var usersRouter = require('./routes/users');
var itemRouter = require('./routes/items');
var wareHouseRouter = require('./routes/wareHouses');
var storageRouter = require('./routes/storages');
app.use('/users', usersRouter);
app.use('/items', itemRouter);
app.use('/wareHouses', wareHouseRouter);
app.use('/storages', storageRouter);

// run server

var server = app.listen(port, function(){
 console.log(`The server is started. (listening on port ${port})`);
})