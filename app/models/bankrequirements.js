/**
 * Created by shayneburgess on 1/9/16.
 */

var mongoose = require('mongoose');

var bankRequirementsSchema = mongoose.Schema({
    bankName: String,
    debtToIncomeRatio: Number,
    minLoan: { type: Number, min: 0, default: 0},
    maxLoan: { type: Number, min: 0, default: 0},
    minFICO: { type: Number, min: 0, default: 0},
    LTV: {
        LTVThreshold1: { type: Number, min: 0, default: 0},
        LTVThreshold2: { type: Number, min: 0, default: 0},
        LTVThreshold3: { type: Number, min: 0, default: 0},
        LTVThreshold4: { type: Number, min: 0, default: 0},
        maxLTV1: { type: Number, min: 0, default: 0},
        maxLTV2: { type: Number, min: 0, default: 0},
        maxLTV3: { type: Number, min: 0, default: 0},
        maxLTV4: { type: Number, min: 0, default: 0},
    }
})

module.exports = mongoose.model('BankRequirements', bankRequirementsSchema);