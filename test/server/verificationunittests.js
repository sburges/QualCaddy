/**
 * Created by shayneburgess on 3/7/16.
 */

var chai = require('chai'),
    Application = require('../../app/models/applications'),
    BankRequirement = require('../../app/models/bankrequirements'),
    VerificationController = require('../../app/controllers/verificationController');

var expect = chai.expect;
var verifier = new VerificationController();

var fakeapplication = new Application({
    name: "FakePerson",
    bank: "0",
    debt: 10001,
    income: 10000,
    loaninformation: {
        state: "CALIFORNIA",
        country: "San Mateo",
        purpose: "Purchase",
        loantype: "PREFERRED",
        loanCategory: "GOVT & NON-CONFORM",
        loanProduct: "10 Year ARM",
        purchasePrice: 1500000,
        downpayment:0.2,
        pmiFactor: 0,
        estimatedClosingCosts: 10000,
        firstMortgageRate: 0.0365,
        lengthOfFirstMortgage: 30,
        secondMortgageRate: 0,
        secondLoanAmount: 0,
        secondLoanType: "FHA"
    },
    propertyinformation: {
        occupancyType: "Primary Residence",
        numberofUnits: 1,
        monthlyHOAInsurance: 250,
        propertyTax: 0.0125
    },
    incomedetails: {
        borrowers: [10000,5000],
        properties: [5000]
    },
    liabilities: {
        properties: [3500],
        otherliabilities: 150,
        primaryPTI: 0
    },
    borrowerdetails: {
        willOccupy: true,
        expectedLoanLength: 30,
        useGiftFunds: false,
        useTrust: false
    }
});

var fakeBank = new BankRequirement({
    bankName: "FakeBank",
    debtToIncomeRatio: 1,
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

describe('VERIFICATION UNIT TESTS', function() {

    it('should calculate loan amount', function (done) {
        var loanamount = verifier.calculateLoanAmount(fakeapplication);
        expect(loanamount).to.equal(1200000);
        done();
    });

    it('should calculate loan amount with empty downpayment', function (done) {
        var originaldownpayment = fakeapplication.loaninformation.downpayment;
        fakeapplication.loaninformation.downpayment = 0;
        var loanamount = verifier.calculateLoanAmount(fakeapplication);
        fakeapplication.loaninformation.downpayment = originaldownpayment;

        expect(loanamount).to.equal(fakeapplication.loaninformation.purchasePrice);
        done();
    });

    it('should calculate loan amount with no financing', function (done) {
        var originaldownpayment = fakeapplication.loaninformation.downpayment;
        fakeapplication.loaninformation.downpayment = 1;
        var loanamount = verifier.calculateLoanAmount(fakeapplication);
        fakeapplication.loaninformation.downpayment = originaldownpayment;

        expect(loanamount).to.equal(0);
        done();
    });

    it('should calculate LTV Guideline', function (done) {
        var guideline = verifier.calculateLTVGuideline(fakeapplication, fakeBank);
        expect(guideline).to.equal(0.8);
        done();
    });


});
