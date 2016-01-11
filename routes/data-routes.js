var mongoose = require('mongoose');

var Applications = require('../models/applications');
var BankRequirements = require('../models/bankrequirements');
var Logging = require('../common/logging');
var ResponseHelper = require('../common/response');

module.exports = function(app) {
    var baseurl = "/data";

    app.get("/applications/", function(req, res) {
        try{
            Applications.find(function(err, applications) {
                if(!err) {
                    Logging.log("Retreived applications from DB: " + applications.length);
                    ResponseHelper.sendResponseObject(res, applications);
                }else{
                    ResponseHelper.sendError(res, err, "Error getting application", 404, "Not found!")
                }
            })
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error in get applications.",
                500,
                "Internal server error!");
        }
    });

    app.get("/applications/:id", function(req, res) {
        try {
            Applications.findOne(
                {_id: req.params.id},
                function (err, application) {
                    if(!err) {
                        Logging.log("Received request for application " +
                            req.params.id);
                        ResponseHelper.sendResponseObject(res, application);
                    }else{
                        ResponseHelper.sendError(res, err, 404, "Application not found!");
                    }
                });
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error in get applications.",
                500,
                "Internal server error!");
        }
    });

    app.delete("/applications/:id", function(req, res){
        Logging.log("Received request to delete id: " + req.params.id);
        try {
            Applications.remove({_id: req.params.id}, function (err) {
                if (!err) {
                    Logging.log("Successfully deleted application with _id:" + req.params.id +
                        " and name: " + req.body.name);
                    ResponseHelper.sendEmpty(res);
                }
                else {
                    ResponseHelper.sendError(res, err, 404, "Application not found!");
                }
            });
            res.send();
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error in delete applications.",
                500,
                "Internal server error!");
        }
    });

    app.post("/applications/:id", function(req, res){
        Logging.log("Received request to edit application with id: " + req.params.id +
                req
        );
        try {
            Applications.update(
                {_id: req.params.id},
                req.body,
                {multi: false},
                function (err, numAffected) {
                    if (err) {
                        ResponseHelper.sendError(res, err, "", 404, "Application not found!");
                    } else {
                        Logging.log("Successfully updated " + numAffected + " rows.");
                        ResponseHelper.sendResponseObject(res, req.body);
                    }
                }
            );
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error in editing application by id.",
                500,
                "Internal server error!");
        }
    });

    app.post("/applications", function(req, res) {
        try {
            if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('debt') || !req.body.hasOwnProperty('income')) {
                res.statusCode = 400;
                return res.send('Error 400: Incorrect post syntax for creating an application. Missing properties.');
            }

            var application = new Applications(req.body)
            Logging.log("Saving new record to DB: " + application.name);
            application._id = null;
            application.save(function (err, newapplcation) {
                if (err) {
                    ResponseHelper.sendError(res, err, 404, "Unable to add application!");
                }
                else {
                    Logging.log("Saved application record! " + newapplcation);
                    ResponseHelper.sendResponseObject(res, newapplcation);
                }
            })
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error on insert application.",
                500,
                "Internal server error!");
        }
    });

    app.get("/banks", function(req, res){
        try {
            BankRequirements.find(function (err, banks) {
                if(!err) {
                    Logging.log("Retreived records from DB: " + banks);
                    ResponseHelper.sendResponseObject(res, banks);
                }else{
                    ResponseHelper.sendError(res, err, "", 404, "Application not found!");
                }
            })
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error in get banks.",
                500,
                "Internal server error!");
        }
    })
};