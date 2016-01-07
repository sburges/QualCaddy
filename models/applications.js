/**
 * Created by shayneburgess on 1/6/16.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('Applications', {name: String, income: Number, debt: Number})