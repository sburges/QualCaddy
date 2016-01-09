/**
 * Created by shayneburgess on 1/9/16.
 */

var mongoose = require('mongoose');

var bankRequirementsSchema = mongoose.Schema({
    bankName: String,
    debtToIncomeRatio: Number
})

module.exports = mongoose.model('BankRequirements', bankRequirementsSchema);

function preLoad(bankName, debtToIncome) {
    var model = mongoose.model('BankRequirements', bankRequirementsSchema);
    model.findOne({bankName: bankName}, function(err, bankRequirement) {
        if(bankRequirement != null) {
            console.log("Retreived bankRequirement from DB skipping seed");
        }else {

            var requirement = new model({
                bankName: bankName,
                debtToIncomeRatio: debtToIncome
            });

            requirement.save(function (err) {
                if(err)
                    console.log("Error saving bankRequirement record! " + err);
                else
                    console.log("Saved bankRequirement record! ");
            });
        }
    })
}

preLoad("WAMU", 1);
preLoad("BankOfBurgess", 0.5)