/**
 * Created by shayneburgess on 1/9/16.
 */

module.exports = function(app) {
    app.get('/config', function(req, res){res.send(
        {url: process.env.APP_URL || "http://localhost:3000/"}
    )});
}
