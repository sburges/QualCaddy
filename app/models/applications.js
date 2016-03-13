/**
 * Created by shayneburgess on 1/6/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bankrequirements = require('./bankrequirements');

var applicationSchema = mongoose.Schema({
    name: String,
    bank: { type: Schema.Types.ObjectId, ref: 'bankrequirements' },
    income: { type: Number, min: 0, default: 0 },
    debt: { type: Number, min: 0, default: 0 },
    borrower: [{ type: Schema.Types.ObjectId, ref: 'borrowers' }],
    loaninformation: {
        state: String,
        country: String,
        purpose: { type: String, default: 'Purchase' },
        loantype: { type: String, default: 'FHA', enum: ['FHA', 'HELOC IO', 'HELOC LTV', 'PREFERRED']},
        loanCategory: { type: String, default: 'GOVT & NON-CONFORM' },
        loanProduct: { type: String, default: '30-year fixed' },
        purchasePrice: { type: Number, min: 0, default: 0},
        downpayment: { type: Number, min: 0, max: 1, default: 0},
        pmiFactor: { type: Number, min: 0, max: 100, default: 0},
        estimatedClosingCosts: { type: Number, min: 0, default: 0},
        firstMortgageRate: { type: Number, min: 0, max: 1, default: 0 },
        lengthOfFirstMortgage: { type: Number, min: 0, default: 0 },
        secondMortgageRate: { type: Number, min: 0, max: 1, default: 0 },
        secondLoanAmount: { type: Number, min: 0, default: 0 },
        secondLoanType: { type: String, default: 'FHA' }
    },
    propertyinformation: {
        occupancyType: { type: String, default: 'Primary Residence' },
        numberofUnits: { type: Number, min: 0, default: 1 },
        monthlyHOAInsurance: { type: Number, min: 0, default: 0 },
        propretyTax: { type: Number, min: 0, default: 0 }
    },
    incomedetails: {
        borrowers: { type: [Number], default: [ 0 ] },
        properties: { type: [Number], default: [ 0 ] }
    },
    liabilities: {
        properties: { type: [Number], default: [ 0 ] },
        otherliabilities: { type: Number, min: 0, default: 0 },
        primaryPTI: { type: Number, min: 0, default: 0 }
    },
    borrowerdetails: {
        willOccupy: { type: Boolean, default: true },
        expectedLoanLength: { type: Number, min: 0, default: 0 },
        useGiftFunds: { type: Boolean, default: false },
        useTrust: { type: Boolean, default: false },
        FICO: { type: Number, default: 0}
    }
});

module.exports = mongoose.model('Applications', applicationSchema);