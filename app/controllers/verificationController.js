/**
 * Created by shayneburgess on 3/8/16.
 */

var BankRequirement = require('../models/bankrequirements'),
    Logging = require('../common/logging');

function VerificationController() {
    var bankRequirements = null;


    this.loadRequirements = function () {
        BankRequirement.find(function (err, bankRequirementList) {
            if (!err) {
                bankRequirements = bankRequirementList;
            }
        });
    };

    this.findBank = function(bank)
    {
        for(var i=0;i<bankRequirements.length;i++) {
            if(bank.equals(bankRequirements[i]._id))
                return bankRequirements[i];
        }
        Logging.log("Was unable to find bank requirement from verify request with id:" + bank);
        Logging.log("Current banks: " + bankRequirements)
    };

    this.calculateLoanAmount = function(application)
    {
        return Math.abs(application.loaninformation.purchasePrice -
            (application.loaninformation.purchasePrice * application.loaninformation.downpayment));
    };

    this.calculateLTVGuideline = function(application, bank)
    {
        var guideline=1;
        var loanAmount = this.calculateLoanAmount(application);
        if (application.loaninformation.purchasePrice <= bank.maxLoan)
            if (loanAmount < bank.LTV.LTVThreshold1)
                guideline = bank.LTV.maxLTV1;
            else if (loanAmount < bank.LTV.LTVThreshold2)
                guideline = bank.LTV.maxLTV2;
            else if (loanAmount < bank.LTV.LTVThreshold3)
                guideline = bank.LTV.maxLTV3;
            else if (loanAmount < bank.LTV.LTVThreshold4)
                guideline = bank.LTV.maxLTV4;
        return Math.min(guideline, 1);
    };

    this.loadRequirements();
}





module.exports = VerificationController;