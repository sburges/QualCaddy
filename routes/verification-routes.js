/**
 * Created by shayne on 1/7/16.
 */

var BankRequirements = require('../models/bankrequirements');
var ApplicationResults = require('../models/applicationresults');

module.exports = function(app) {

    app.bankRequirements = null;

    app.post("/verify", function (req, res) {
        try {
            var name = req.body.name;
            var income = req.body.income;
            var debt = req.body.debt;
            var bank = req.body.bank;
            var result = true;
            var reason = "You have been approved!";

            console.log("Received verify requests: " +
                name + ", " +
                bank + ", " +
                income + ", " +
                debt
            );

            bank = findBank(bank);

            if (debt / income > bank.debtToIncomeRatio) {
                result = false
                reason = "Debt to income ratio to high";
            }

            var applicationResult = new ApplicationResults({
                name: name,
                result: result,
                reason: reason
            });

            res.send(applicationResult);
        }catch(err)
        {
            console.log(err);
            res.status(500);
            res.send("Oops. Something went wrong.");
        }
    });

    function loadRequirements()
    {
        BankRequirements.find(function(err, bankRequirements) {
            if(!err) {
                console.log("Retreived records from DB: " +
                    bankRequirements
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
        console.log("Was unable to find bank requirement from verify request with id:" + bank);
        console.log("Current banks: " + app.bankRequirements)
        return null;
    }

    function preLoad(bankName, debtToIncome) {
        BankRequirements.findOne({bankName: bankName}, function(err, bankRequirement) {
            if(bankRequirement != null) {
                console.log("Retreived bankRequirement from DB skipping seed");
            }else {

                var requirement = new BankRequirements({
                    bankName: bankName,
                    debtToIncomeRatio: debtToIncome
                });

                requirement.save(function (err) {
                    if(err)
                        console.log("Error saving bankRequirement record! " + err);
                    else {
                        console.log("Saved bankRequirement record! ");
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