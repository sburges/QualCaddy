/**
 * Created by shayneburgess on 1/6/16.
 */

var mongoose = require('mongoose');

var applicationResultSchema = mongoose.Schema({
    name: String,
    result: Boolean,
    reason: String,
    LTVGuideline: { type: Number, min: 0, default: 0},
    LTVActual: { type: Number, min: 0, default: 0},
    DTIGuideline: { type: Number, min: 0, default: 0},
    DTIActual: { type: Number, min: 0, default: 0},
    FICOGuideline: { type: Number, min: 0, default: 0},
    FICOActual: { type: Number, min: 0, default: 0},
    TotalAssetsReq: { type: Number, min: 0, default: 0},
    TotalAssetsActual: { type: Number, min: 0, default: 0},
    CashToCloseRequired: { type: Number, min: 0, default: 0},
    CashToCloseActual: { type: Number, min: 0, default: 0},
    TotalReservesRequired: { type: Number, min: 0, default: 0},
    TotalReservesActual: { type: Number, min: 0, default: 0},
    LiquidReservesRequired: { type: Number, min: 0, default: 0},
    LiquidReservesActual: { type: Number, min: 0, default: 0},
    AmountToLiquidateRequired: { type: Number, min: 0, default: 0},
    AmountToLiquidateActual: { type: Number, min: 0, default: 0},
    Income: {
        Monthly: { type: Number, min: 0, default: 0},
        RSU: { type: Number, min: 0, default: 0},
        Rental: { type: Number, min: 0, default: 0},
        NetRental: { type: Number, min: 0, default: 0}
    },
    Liabilities: {
        RealEstate: { type: Number, min: 0, default: 0},
        Other: { type: Number, min: 0, default: 0},
        PrimaryPTI: { type: Number, min: 0, default: 0}
    },
    HomePayments: {
        MortgatePayment: { type: Number, min: 0, default: 0},
        SecondMortgatePayment: { type: Number, min: 0, default: 0},
        PMI: { type: Number, min: 0, default: 0},
        HOA: { type: Number, min: 0, default: 0},
        Insurance: { type: Number, min: 0, default: 0},
        Taxes: { type: Number, min: 0, default: 0},
    },
    HomePaymentsAmortized: {
        MortgatePayment: { type: Number, min: 0, default: 0},
        SecondMortgatePayment: { type: Number, min: 0, default: 0},
        PMI: { type: Number, min: 0, default: 0},
        HOA: { type: Number, min: 0, default: 0},
        Insurance: { type: Number, min: 0, default: 0},
        Taxes: { type: Number, min: 0, default: 0},
    }
})

module.exports = mongoose.model('ApplicationResults', applicationResultSchema);