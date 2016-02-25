/**
 * Created by shayneburgess on 1/11/16.
 */

var debuglevel = process.env.DEBUG_LEVEL;
module.exports = {
    log: function(message)
    {
        var date = new Date();
        console.log(date.toString() + " - Server message: " + message);
    }
}