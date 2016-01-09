/**
 * Created by shayne on 1/7/16.
 */

var BankRequirements = require('../models/bankrequirements');
var ApplicationResults = require('../models/applicationresults');

module.exports = function(app) {

    app.bankRequirements = null;

    app.post("/verify/:id", function (req, res) {
        var name = req.body.name;
        var income = req.body.income;
        var debt = req.body.debt;
        var result = true;
        var reason = "You have been approved!";

        console.log("Received verify requests: " +
                name + ", " +
                income + ", " +
                debt
        );

        if(debt/income > app.bankRequirements.debtToIncomeRatio)
        {
            result = false
            reason = "Debt to income ratio to high";
        }

        var applicationResult = new ApplicationResults({
            name: name,
            result: result,
            reason: reason
        });

        console.log("Sending response: " + applicationResult)

        res.send(applicationResult);
    });

    function loadRequirements(bankName)
    {
        BankRequirements.findOne({bankName: bankName}, handleLoad);
    }

    function handleLoad(err, bank){
        if(!err)
        {
            app.bankRequirements = bank;
        }
    }

    loadRequirements("WAMU");

}