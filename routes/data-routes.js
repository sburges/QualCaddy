var mongoose = require('mongoose');

var Applications = require('../models/applications');
var BankRequirements = require('../models/bankrequirements');

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
                if(err){
                    console.log("Error updating application: " + err);
                }else{
                    console.log("Successfully updated " + numAffected + " rows.");
                }
            }
        );
        res.statusCode = 200;
        res.send("Request to update application has been accepted.");
    });

    app.post("/applications", function(req, res) {

        if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('name'))
        {
            res.statusCode = 400;
            return res.send('Error 400: Incorrect post syntax for creating an application. Missing properties.');
        }

        var application = new Applications(req.body)
        console.log("Saving new record to DB: " +
                application.name + ", " +
                application.bank + ", " +
                application.income + ", " +
                application.debt
        );
        application._id = null;
        application.save(function (err) {
            if(err)
                console.log("Error saving application: " + err)
            else
                console.log("Saved application record! ");

        })
        res.statusCode = 200;
        res.send("Request to add application accepted.");
    });

    app.get("/banks", function(req, res){
        BankRequirements.find(function(err, banks) {
            console.log("Retreived records from DB: " +
                banks
            );
            res.send(banks);
        })
    })
};