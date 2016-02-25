/**
 * Created by shayneburgess on 1/9/16.
 */

var mongoose = require('mongoose');

var bankRequirementsSchema = mongoose.Schema({
    bankName: String,
    debtToIncomeRatio: Number
})

module.exports = mongoose.model('BankRequirements', bankRequirementsSchema);