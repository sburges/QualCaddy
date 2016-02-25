/**
 * Created by shayneburgess on 1/10/16.
 */

var Logging = require('./logging');

module.exports = {
    sendError: function(res, err, logmessage, statusCode, responsemessage) {
        Logging.log(logmessage + ": " + statusCode + ": " + err);
        res.status(statusCode);
        res.send(responsemessage);
    },

    sendEmpty: function(res)
    {
        res.statusCode = 200;
        res.send();
    },

    sendResponseObject: function(res, object)
    {
        Logging.log("Sending response: " + object)
        res.statusCode = 200;
        res.send(object);
    }
}
