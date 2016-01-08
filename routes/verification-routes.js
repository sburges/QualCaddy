/**
 * Created by shayne on 1/7/16.
 */

var Applications = require('../models/applications');
var ApplicationResults = require('../models/applicationresults');

module.exports = function(app) {

    app.post("/verify/", function (req, res) {
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

        if(debt/income > 1)
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
}