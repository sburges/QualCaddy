/**
 * Created by shayneburgess on 1/6/16.
 */
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser());

var mongoose = require("mongoose");

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

var Qualification = mongoose.model('Qualification', {name: String, income: Number, debt: Number})

app.get("/qualification/", function(req, res) {
    Qualification.find(function(err, qualifications) {
        res.send(qualifications);
    })
})

app.post("/qualification/add", function(req, res) {
    var name = req.body.name;
    var income = req.body.income;
    var debt = req.body.debt;

    var qualification = new Qualification({
        name: name,
        income: income,
        debt: debt
    })

    qualification.save(function (err) {
        res.send();
    })
})

app.listen(3000);