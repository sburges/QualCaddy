/**
 * Created by shayne on 1/11/16.
 */

var mongoose = require('mongoose');

var Applications = require('../models/applications');
var Banks = require('../models/bankrequirements');
var Logging = require('../common/logging');
var ResponseHelper = require('../common/response');

module.exports = function(app) {
    app.get("/nothing", function(req,res){
       res.send("BLAH");
    });

    app.post("/admin/banks/:id", function(req, res){
        Logging.log("Received request to edit bank with id: " + req.params.id +
                req
        );
        try {
            Banks.update(
                {_id: req.params.id},
                req.body,
                {multi: false},
                function (err, numAffected) {
                    if (err) {
                        ResponseHelper.sendError(res, err, "", 404, "Bank not found!");
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
                "Internal server error in updating bank.",
                500,
                "Internal server error!");
        }
    });

    app.delete("/admin/banks/:id", function(req, res){
        Logging.log("Received request to delete id: " + req.params.id);
        try {
            Banks.remove({_id: req.params.id}, function (err) {
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

    app.post("/admin/banks", function(req, res) {
        try {
            if (!req.body.hasOwnProperty('bankName') || !req.body.hasOwnProperty('debtToIncomeRatio')) {
                res.statusCode = 400;
                return res.send('Error 400: Incorrect post syntax for creating an application. Missing properties.');
            }

            var bank = new Banks(req.body)
            Logging.log("Saving new record to DB: " + bank.bankName);
            bank._id = null;
            bank.save(function (err, bank) {
                if (err) {
                    ResponseHelper.sendError(res, err, 404, "Unable to add application!");
                }
                else {
                    Logging.log("Saved application record! " + bank);
                    ResponseHelper.sendResponseObject(res, bank);
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

    app.get("/admin/banks/:id", function(req, res) {
        try {
            Banks.findOne(
                {_id: req.params.id},
                function (err, bank) {
                    if(!err) {
                        Logging.log("Received request for bank " +
                            req.params.id);
                        ResponseHelper.sendResponseObject(res, bank);
                    }else{
                        ResponseHelper.sendError(res, err, 404, "Bank not found!");
                    }
                });
        }catch(err)
        {
            ResponseHelper.sendError(
                res,
                err,
                "Internal server error in get bank.",
                500,
                "Internal server error!");
        }
    });
};