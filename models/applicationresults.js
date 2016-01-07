/**
 * Created by shayneburgess on 1/6/16.
 */

var mongoose = require('mongoose');

var applicationResultSchema = mongoose.Schema({
    name: String,
    result: Boolean,
    reason: String
})

module.exports = mongoose.model('ApplicationResults', applicationResultSchema)