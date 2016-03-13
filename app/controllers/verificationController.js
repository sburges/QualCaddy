/**
 * Created by shayneburgess on 3/8/16.
 */

var BankRequirement = require('../models/bankrequirements'),
    ApplicationResult = require('../models/applicationresults'),
    Logging = require('../common/logging');

function VerificationController() {
    var bankRequirements = null;

    //DEFAULT TODO: Make variables
    const DEFAULT_DTI = 0.43;
    const HELOC_FICO_SCORE = 740;

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

    this.calculateFullResult = function(application, bank)
    {
        var applicationResult = new ApplicationResult();

        applicationResult.result = true;
        applicationResult.reason = "You have been approved!";

        applicationResult.LTVGuideline = this.calculateLTVGuideline(application, bank);
        applicationResult.LTVActual = this.calculateLTVActual(application, bank);
        applicationResult.DTIGuideline = this.calculateDTIGuideline(application, bank);
        applicationResult.FICOGuideline = this.calculateFICOGuidelines(application, bank);



        if (application.debt / application.income > bank.debtToIncomeRatio) {
            applicationResult.result = false;
            applicationResult.reason = (applicationResult.reason + " Debt to income ratio to high.").trim();
        }

        return applicationResult;
    }

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

    //(1st Loan Amount – Second Loan Amount) / Purchase Price
    this.calculateLTVActual = function(application, bank)
    {
        var loanamount = this.calculateLoanAmount(application);
        return (loanamount - application.loaninformation.secondLoanAmount) /
                application.loaninformation.purchasePrice;
    }

    //IF (1st Loan Amount > 1.5M && 1st Loan Amount <= 2000000 && LTV > 0.75 && LTV <= 0.8)
    //RETURN 0.43
    //ELSE
    //RETURN Max DTI
    this.calculateDTIGuideline = function (application, bank)
    {
        var loanamount = this.calculateLoanAmount(application);
        var LTVActual = this.calculateLTVActual(application, bank);
        if (loanamount > 1500000 && loanamount <= 2000000 && LTVActual > 0.75 && LTVActual <= 0.8)
        {
            return DEFAULT_DTI;
        }else{
            return bank.DTI.maxDTI;
        }
    }

    this.calculateTotalHousePayment = function(application)
    {
        //TODO
    }

    this.calculateTotalLiabilities = function(application)
    {
        //TODO
    }

    this.calculateTotalIncome = function(application)
    {
        //TODO
    }

    //DTI = (Total Housing Payment + Total Liabilities) / Total Income
    this.calculateDTIActual = function(application, bank)
    {
        //TODO
        return 0.4887
    }

    //IF (Loan Type = “HELOC IO – HIGH LTV”)
    //RETURN 740
    //ELSE IF (Loan Type = “PREFERRED” && Fixed or ARM = “ARM”)
    //RETURN NonQM Min FICO
    //ELSE
    //RETURN Min FICO
    this.calculateFICOGuidelines = function(application, bank)
    {
        if(application.loaninformation.loantype == "HELOC IO" ||
            application.loaninformation.loantype == "HIGH LTV")
        {
            return HELOC_FICO_SCORE;
        }else if (application.loaninformation.loantype == "PREFERRED" && (application.loaninformation.loanProduct.indexOf("ARM") > -1))
        {
            return this.caculateNonQMMinFICO(application, bank);
        }else{
            return bank.minFICO;
        }
    }

    //IF (DTI >= NonQM DTI Low && DTI < NonQM DTI High)
    //RETURN NonQM Class 1 FICO
    //ELSE IF (DTI >= NonQM DTI High && DTI <= Max DTI)
    //RETURN NonQM Class 2 FICO
    //ELSE
    //RETURN “SVP Approval Required”
    this.caculateNonQMMinFICO = function(application, bank)
    {
        var DTI = this.calculateDTIActual(application, bank);
        if (DTI >= bank.DTI.nonQMDTILow && DTI < bank.DTI.nonQMDTIHigh) {
            return bank.DTI.nonQMClass1FICO;
        } else if (DTI >= bank.DTI.nonQMDTIHigh && DTI >= bank.DTI.maxDTI) {
            return bank.DTI.nonQMClass2FICO;
        } else {
            //TODO THIS HAS TO BECOME A BAD VALUE SOMEHOW: SVP APPROVAL REQUIRED
            return 0;
        }
    }

    this.loadRequirements();
}





module.exports = VerificationController;
