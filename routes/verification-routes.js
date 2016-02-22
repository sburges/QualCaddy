/**
 * Created by shayne on 1/7/16.
 */

var BankRequirements = require('../models/bankrequirements');
var ApplicationResults = require('../models/applicationresults');
var Logging = require('../common/logging');
var ResponseHelper = require('../common/response');

module.exports = function(app) {

    app.bankRequirements = null;

    app.post("/verify", function (req, res) {
        try {
            var name = req.body.name;
            var income = req.body.income.borrowers[0];
            var debt = req.body.debt;
            var bank = req.body.bank;
            var result = true;
            var reason = "You have been approved!";

            Logging.log("Received verify request: " + name);

            bank = findBank(bank);

            if (debt / income > bank.debtToIncomeRatio) {
                result = false
                reason = "Debt to income ratio to high";
            }

            ResponseHelper.sendResponseObject(res, new ApplicationResults({
                name: name,
                result: result,
                reason: reason
            }));
        }catch(err)
        {
            ResponseHelper.sendError(res, err, "", 500, "Internal server error on verify: ");
        }
    });

    function loadRequirements()
    {
        BankRequirements.find(function(err, bankRequirements) {
            if(!err) {
                Logging.log("Retreived records from DB: " +
                    bankRequirements.bankName
                );
                app.bankRequirements = bankRequirements;
            }
        });
    };

    function findBank(bank)
    {
        for(var i=0;i<app.bankRequirements.length;i++) {
            if(app.bankRequirements[i]._id == bank)
                return app.bankRequirements[i];
        }
        Logging.log("Was unable to find bank requirement from verify request with id:" + bank);
        Logging.log("Current banks: " + app.bankRequirements)
        return null;
    }

    function preLoad(bankName, debtToIncome) {
        BankRequirements.findOne({bankName: bankName}, function(err, bankRequirement) {
            if(bankRequirement != null) {
                Logging.log("Retreived bankRequirement from DB skipping seed");
            }else {

                var requirement = new BankRequirements({
                    bankName: bankName,
                    debtToIncomeRatio: debtToIncome
                });

                requirement.save(function (err) {
                    if(err)
                        Logging.log("Error saving bankRequirement record! " + err);
                    else {
                        Logging.log("Saved bankRequirement record! ");
                        loadRequirements();
                    }
                });
            }
        })
    }

    preLoad("WAMU", 1);
    preLoad("BankOfBurgess", 0.5)
    loadRequirements();
}