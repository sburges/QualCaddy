/**
 * Created by shayneburgess on 2/21/16.
 */

var mongoose = require('mongoose');

var fieldFlagsSchema = mongoose.Schema({
    user: { type: String, default: "NoUsernameGiven" },
    datereported: { type: String, default: Date.now },
    field: { type: String, default: "No Field Specified" },
    message: { type: String, default: "Something was wrong with this field" }
})

module.exports = mongoose.model('FieldFlags', fieldFlagsSchema);