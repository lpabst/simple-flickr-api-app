const express = require('express');
var config = require('./config.js');

const app = module.exports = express();

app.use(express.static(__dirname + './../build'))

app.listen(config.port, console.log("you are now connected on " + config.port));