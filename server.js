/**
 * Created by shayneburgess on 1/6/16.
 */

'use strict';

var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var http = require('http');
var mongoose = require('mongoose');

var app = express();
app.use(cors());
app.use(bodyParser());

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/qualcaddy';

mongoose.connect(uristring, function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + uristring);
    }
});

require('./routes/data-routes')(app);
require('./routes/verification-routes')(app);
require('./routes/configs')(app);
app.use(express.static(__dirname + '/app'));


var server = http.createServer(app);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});