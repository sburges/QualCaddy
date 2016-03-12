/**
 * Created by shayne on 1/7/16.
 */

var BankRequirement = require('../models/bankrequirements');
var ApplicationResult = require('../models/applicationresults');
var Application = require('../models/applications');
var Logging = require('../common/logging');
var VerificationController = require('../controllers/verificationController');
var ResponseHelper = require('../common/response');

module.exports = function(app) {
    var verifier = new VerificationController();

    app.post("/verify", function (req, res) {
        try {

            var application = new Application(req.body);

            var result = new ApplicationResult();
            result.result = true;
            result.reason = "You have been approved!";

            Logging.log("Received verify request: " + application.name);

            var bank = verifier.findBank(application.bank);
            if(bank == null)
                throw "Unable to find bank specified in application";

            result.LTVGuideline = verifier.calculateLTVGuideline(application, bank);
            //result.LTVActual

            if (application.debt / application.income > bank.debtToIncomeRatio) {
                result.result = false;
                result.reason = "Debt to income ratio to high";
           }

            ResponseHelper.sendResponseObject(res, result);
        }catch(err)
        {
            ResponseHelper.sendError(res, err, "", 500, "Internal server error on verify: ");
        }
    });

    function preLoad(bankName, debtToIncome) {
        BankRequirement.findOne({bankName: bankName}, function(err, bankRequirement) {
            if(bankRequirement != null) {
                Logging.log("Retreived bankRequirement from DB skipping seed");
            }else {

                var requirement = new BankRequirement({
                    bankName: bankName,
                    debtToIncomeRatio: debtToIncome,
                    minLoan: 250000,
                    maxLoan: 20000000,
                    minFICO: 700,
                    LTV: {
                        LTVThreshold1: 1000000,
                        LTVThreshold2: 2000000,
                        LTVThreshold3: 2500000,
                        LTVThreshold4: 20000000,
                        maxLTV1: 0.8,
                        maxLTV2: 0.8,
                        maxLTV3: 0.7,
                        maxLTV4: 0.65
                    }
                });

                requirement.save(function (err) {
                    if(err)
                        Logging.log("Error saving bankRequirement record! " + err);
                    else {
                        Logging.log("Saved bankRequirement record! ");
                        verifier.loadRequirements();
                    }
                });
            }
        })
    }

    preLoad("WAMU", 1);
    preLoad("BankOfBurgess", 0.5);
}