/**
 * Created by shayneburgess on 2/23/16.
 */
var mongoose = require('mongoose');

var borrowerSchema = mongoose.Schema({
    name: String,
    address: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    yrsInJob: { type: Number, min: 0, default: 0 },
    typeOfBusiness: { type: String, default: "" },
    otherIncome: { type: String, default: "" },
    2106: { type: String, default: "" },
    FICO: { type: Number, default: "" },
    notes: { type: String, default: "" }
});

module.exports = mongoose.model('Borrower', borrowerSchema);