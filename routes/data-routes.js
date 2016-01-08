var mongoose = require('mongoose');

var Applications = require('../models/applications');
var ApplicationResults = require('../models/applicationresults');

module.exports = function(app) {
    var baseurl = "/data";

    app.get("/applications/", function(req, res) {
        Applications.find(function(err, applications) {
            console.log("Retreived records from DB: " +
                applications
            );
            res.send(applications);
        })
    });

    app.delete("/applications/:id", function(req, res){
        console.log("Received request to delete id: " + req.params.id);
        Applications.remove({ _id: req.params.id }, function(err) {
            if (!err) {
                console.log("Successfully deleted application with _id:" + req.params.id +
                    " and name: " + req.body.name);
                res.statusCode = 200;
            }
            else {
                console.log("Failed to deleted application with _id:" + req.params.id +
                    " and name: " + req.body.name);
                req.statusCode = 500;
            }
        });
        res.send();
    });

    app.post("/applications/:id", function(req, res){
        console.log("Received request to edit application with id: " + req.params.id +
                req
        );
        Applications.update(
            { _id: req.params.id},
            req.body,
            {multi: false},
            function(err, numAffected)
            {
               console.log("Successfully updated " + numAffected + " rows.");
            }
        );
    });

    app.post("/applications", function(req, res) {

        if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('name'))
        {
            res.statusCode = 400;
            return res.send('Error 400: Incorrect post syntax for creating an application. Missing properties.');
        }


        var name = req.body.name;
        var income = req.body.income;
        var debt = req.body.debt;

        var application = new Applications({
            name: name,
            income: income,
            debt: debt
        })
        console.log("Saving new record to DB: " +
                application.name + ", " +
                application.income + ", " +
                application.debt
        );

        application.save(function (err) {
            console.log("Error saving record! " + err)
        })
        res.statusCode = 200;
        res.send("Request to add application accepted.");
    });
};