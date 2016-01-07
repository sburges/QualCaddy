
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

    app.post("/applications/add", function(req, res) {
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
            res.send();
            console.log("Error saving record! " + err)
        })
    });
};