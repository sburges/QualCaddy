/**
 * Created by shayneburgess on 1/6/16.
 */

var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
    name: String,
    income: Number,
    debt: Number
})

module.exports = mongoose.model('Applications', applicationSchema)