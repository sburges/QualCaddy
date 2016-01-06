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

mongoose.connect('mongodb://localhost/qualcaddy')

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